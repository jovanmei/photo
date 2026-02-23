import * as React from "react";
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "./UI";

interface ConfigStatus {
  cloudName: boolean;
  uploadPreset: boolean;
  connectionTest: "idle" | "testing" | "success" | "error";
  errorMessage?: string;
}

export const CloudinaryConfigCheck: React.FC = () => {
  const [status, setStatus] = React.useState<ConfigStatus>({
    cloudName: false,
    uploadPreset: false,
    connectionTest: "idle",
  });
  const [details, setDetails] = React.useState<{
    cloudName: string;
    uploadPreset: string;
  }>({ cloudName: "", uploadPreset: "" });

  React.useEffect(() => {
    // Check environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

    setDetails({ cloudName, uploadPreset });
    setStatus({
      cloudName: !!cloudName,
      uploadPreset: !!uploadPreset,
      connectionTest: "idle",
    });
  }, []);

  const testConnection = async () => {
    setStatus((prev) => ({ ...prev, connectionTest: "testing" }));

    try {
      // Test with a small empty request to check if cloud name is valid
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${details.cloudName}/image/upload`,
        {
          method: "POST",
          body: new FormData(),
        }
      );

      // 400 is expected since we're not sending valid data
      // but it means the cloud name exists
      if (response.status === 400) {
        const data = await response.json();
        if (data.error && data.error.message) {
          // Check if error is about missing file (which is expected)
          if (data.error.message.includes("file") || data.error.message.includes("upload_preset")) {
            setStatus((prev) => ({
              ...prev,
              connectionTest: "success",
            }));
            return;
          }
        }
      }

      // If we get here, there might be a real error
      setStatus((prev) => ({
        ...prev,
        connectionTest: "error",
        errorMessage: `Cloud name "${details.cloudName}" appears to be invalid. Please check your Cloudinary dashboard.`,
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        connectionTest: "error",
        errorMessage: "Network error. Please check your internet connection.",
      }));
    }
  };

  return (
    <div className="p-6 border border-neutral-200 rounded-sm bg-neutral-50">
      <h3 className="text-sm font-bold mb-4">Cloudinary Configuration Check</h3>

      <div className="space-y-3">
        {/* Cloud Name Check */}
        <div className="flex items-center gap-3">
          {status.cloudName ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <div className="flex-1">
            <p className="text-sm">
              Cloud Name: {status.cloudName ? "✓ Configured" : "✗ Missing"}
            </p>
            {details.cloudName && (
              <p className="text-xs opacity-40">{details.cloudName}</p>
            )}
          </div>
        </div>

        {/* Upload Preset Check */}
        <div className="flex items-center gap-3">
          {status.uploadPreset ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <div className="flex-1">
            <p className="text-sm">
              Upload Preset: {status.uploadPreset ? "✓ Configured" : "✗ Missing"}
            </p>
            {details.uploadPreset && (
              <p className="text-xs opacity-40">{details.uploadPreset}</p>
            )}
          </div>
        </div>

        {/* Connection Test */}
        <div className="flex items-center gap-3">
          {status.connectionTest === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : status.connectionTest === "error" ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : status.connectionTest === "testing" ? (
            <RefreshCw className="w-5 h-5 animate-spin opacity-40" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
          )}
          <div className="flex-1">
            <p className="text-sm">
              Connection Test:{" "}
              {status.connectionTest === "idle"
                ? " Not tested"
                : status.connectionTest === "testing"
                ? " Testing..."
                : status.connectionTest === "success"
                ? " ✓ Passed"
                : " ✗ Failed"}
            </p>
            {status.errorMessage && (
              <p className="text-xs text-red-500 mt-1">{status.errorMessage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <Button
          onClick={testConnection}
          disabled={!status.cloudName || status.connectionTest === "testing"}
          variant="outline"
          className="text-xs"
        >
          Test Connection
        </Button>
      </div>

      {/* Help Text */}
      {(!status.cloudName || !status.uploadPreset) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
          <p className="text-xs text-yellow-800">
            <strong>Configuration Required:</strong>
          </p>
          <ol className="text-xs text-yellow-700 mt-1 list-decimal list-inside space-y-1">
            <li>Create a .env.local file in project root</li>
            <li>Add: VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name</li>
            <li>Add: VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default CloudinaryConfigCheck;
