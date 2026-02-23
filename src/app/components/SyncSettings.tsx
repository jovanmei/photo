import * as React from "react";
import { toast } from "sonner";
import { GistSyncService } from "../utils/gistSync";
import { useAlbums } from "../context/AlbumContext";
import { saveAlbumsToStorage } from "../data/albums";
import { Cloud, Download, Upload, Unlink, ExternalLink, Key, Check, AlertCircle, Link2 } from "lucide-react";

export const SyncSettings = () => {
  const { albums } = useAlbums();
  const [token, setToken] = React.useState("");
  const [gistIdInput, setGistIdInput] = React.useState("");
  const [showGistIdInput, setShowGistIdInput] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(GistSyncService.isAuthenticated());
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [gistUrl, setGistUrl] = React.useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = React.useState<string | null>(
    GistSyncService.getLastSyncTime()
  );

  React.useEffect(() => {
    const status = GistSyncService.getSyncStatus();
    setIsConnected(status.isConnected);
    setGistUrl(status.gistUrl);
    setLastSyncTime(status.lastSyncTime);
  }, []);

  const handleConnect = async () => {
    if (!token.trim()) {
      toast.error("Please enter a GitHub token");
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await GistSyncService.validateToken(token.trim());
      if (!isValid) {
        toast.error("Invalid GitHub token. Please check and try again.");
        return;
      }
      
      GistSyncService.setToken(token.trim());
      setIsConnected(true);
      toast.success("Connected to GitHub Gist successfully!");
      setToken("");
    } catch (error) {
      toast.error("Failed to validate token. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Disconnect from GitHub Gist?\n\nYour local data will be preserved. You can reconnect anytime with your token.")) {
      GistSyncService.disconnect();
      setIsConnected(false);
      setGistUrl(null);
      setLastSyncTime(null);
      toast.success("Disconnected from GitHub Gist");
    }
  };

  const handleUpload = async () => {
    if (!isConnected) return;
    
    if (albums.length === 0) {
      toast.error("No albums to upload");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await GistSyncService.upload(albums);
      setGistUrl(result.url);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      toast.success("Data uploaded to cloud successfully!", {
        action: {
          label: "View Gist",
          onClick: () => window.open(result.url, '_blank')
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownload = async () => {
    if (!isConnected) return;

    setIsSyncing(true);
    try {
      const data = await GistSyncService.download();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from cloud");
      }

      const processedData = data.map((album: any) => ({
        ...album,
        createdAt: new Date(album.createdAt),
        photos: album.photos.map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          name: photo.name,
          description: photo.description,
          location: photo.location,
          uploadDate: new Date(photo.uploadDate)
        }))
      }));

      console.log('Downloaded data:', processedData);
      saveAlbumsToStorage(processedData);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      
      const status = GistSyncService.getSyncStatus();
      setGistUrl(status.gistUrl);
      
      toast.success(`Downloaded ${processedData.length} album(s) from cloud! Refreshing...`, {
        duration: 2000
      });
      
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      if (error.message === 'NO_GIST_FOUND') {
        toast.error("No synced data found. Please upload data first, or enter a Gist ID manually.", {
          duration: 5000
        });
        setShowGistIdInput(true);
      } else {
        toast.error(error.message || "Failed to download data");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadWithGistId = async () => {
    if (!gistIdInput.trim()) {
      toast.error("Please enter a Gist ID");
      return;
    }

    setIsSyncing(true);
    try {
      const data = await GistSyncService.downloadGistWithId(gistIdInput.trim());
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from cloud");
      }

      const processedData = data.map((album: any) => ({
        ...album,
        createdAt: new Date(album.createdAt),
        photos: album.photos.map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          name: photo.name,
          description: photo.description,
          location: photo.location,
          uploadDate: new Date(photo.uploadDate)
        }))
      }));

      console.log('Downloaded data with Gist ID:', processedData);
      saveAlbumsToStorage(processedData);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      
      const status = GistSyncService.getSyncStatus();
      setGistUrl(status.gistUrl);
      setShowGistIdInput(false);
      setGistIdInput("");
      
      toast.success(`Downloaded ${processedData.length} album(s) from cloud! Refreshing...`, {
        duration: 2000
      });
      
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to download data with the provided Gist ID");
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border-2 border-black bg-white">
      <div className="p-4 md:p-6 border-b border-black/10">
        <div className="flex items-center gap-3">
          <Cloud size={20} />
          <h3 className="text-lg font-black tracking-tighter">Cloud Sync</h3>
          {isConnected && (
            <span className="text-[9px] bg-green-100 text-green-700 px-2 py-1 uppercase tracking-wider font-bold flex items-center gap-1">
              <Check size={10} />
              Connected
            </span>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-[12px] text-blue-800">
                <p className="font-bold mb-1">How to get a GitHub Token:</p>
                <ol className="list-decimal list-inside space-y-1 opacity-80">
                  <li>Go to GitHub Settings → Developer settings</li>
                  <li>Click "Personal access tokens" → "Tokens (classic)"</li>
                  <li>Click "Generate new token (classic)"</li>
                  <li>Select only the "gist" permission</li>
                  <li>Copy the generated token</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="flex-1 border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]"
                disabled={isValidating}
              />
              <button
                onClick={handleConnect}
                disabled={isValidating || !token.trim()}
                className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
              >
                {isValidating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    CONNECTING...
                  </>
                ) : (
                  <>
                    <Key size={14} />
                    CONNECT
                  </>
                )}
              </button>
            </div>

            <a 
              href="https://github.com/settings/tokens/new?scopes=gist&description=Photo%20Gallery%20Sync"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] underline opacity-60 hover:opacity-100 transition-opacity"
            >
              <ExternalLink size={12} />
              Create a new GitHub token with gist permission
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {lastSyncTime && (
              <div className="flex items-center gap-2 text-[10px] opacity-50">
                <span>Last sync:</span>
                <span>{formatDate(lastSyncTime)}</span>
              </div>
            )}

            {gistUrl && (
              <a
                href={gistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] underline opacity-60 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={12} />
                View your synced data on GitHub Gist
              </a>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleUpload}
                disabled={isSyncing}
                className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Upload size={14} />
                UPLOAD TO CLOUD
              </button>
              
              <button
                onClick={handleDownload}
                disabled={isSyncing}
                className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Download size={14} />
                DOWNLOAD FROM CLOUD
              </button>
              
              <button
                onClick={() => setShowGistIdInput(!showGistIdInput)}
                disabled={isSyncing}
                className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Link2 size={14} />
                ENTER GIST ID
              </button>
              
              <button
                onClick={handleDisconnect}
                disabled={isSyncing}
                className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500 border-2 border-red-500 px-4 md:px-6 py-3 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Unlink size={14} />
                DISCONNECT
              </button>
            </div>

            {showGistIdInput && (
              <div className="p-4 bg-gray-50 border border-gray-200 space-y-3">
                <p className="text-[11px] opacity-70">
                  If you uploaded data from another device, enter the Gist ID to download it here.
                  You can find the Gist ID in the URL when viewing your Gist on GitHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={gistIdInput}
                    onChange={(e) => setGistIdInput(e.target.value)}
                    placeholder="e.g., abc123def456..."
                    className="flex-1 border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]"
                    disabled={isSyncing}
                  />
                  <button
                    onClick={handleDownloadWithGistId}
                    disabled={isSyncing || !gistIdInput.trim()}
                    className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Download size={14} />
                    DOWNLOAD
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] opacity-40">
              Tip: Upload your data on one device, then download on another device to sync.
              The system will automatically find your existing Gist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
