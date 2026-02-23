import * as React from "react";
import { toast } from "sonner";
import { Album } from "../data/albums";
import { DataValidator, CodeExporter } from "../utils/dataExporter";
import { Copy, Download, CheckCircle2, AlertCircle, FileCode } from "lucide-react";

interface DataExportProps {
  albums: Album[];
}

export const DataExport: React.FC<DataExportProps> = ({ albums }) => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState<ReturnType<typeof DataValidator.validateAlbums> | null>(null);
  const [showCode, setShowCode] = React.useState(false);

  const handleValidate = React.useCallback(() => {
    setIsValidating(true);
    try {
      const result = DataValidator.validateAlbums(albums);
      setValidationResult(result);
      
      if (result.isValid) {
        if (result.warnings.length > 0) {
          toast.success(`Data is valid! ${result.warnings.length} warning(s)`, {
            duration: 4000
          });
        } else {
          toast.success("Data is valid and ready for export!");
        }
      } else {
        toast.error(`Validation failed! ${result.errors.length} error(s)`, {
          duration: 5000
        });
      }
    } catch (error) {
      toast.error("Validation failed");
    } finally {
      setIsValidating(false);
    }
  }, [albums]);

  const handleCopyCode = React.useCallback(async () => {
    if (validationResult && !validationResult.isValid) {
      toast.error("Please fix validation errors before copying");
      return;
    }

    setIsCopying(true);
    try {
      const code = CodeExporter.exportToTypeScript(albums);
      const success = await CodeExporter.copyToClipboard(code);
      
      if (success) {
        toast.success("TypeScript code copied to clipboard!");
      } else {
        toast.error("Failed to copy to clipboard. Try downloading instead.");
      }
    } catch (error) {
      toast.error("Failed to generate code");
    } finally {
      setIsCopying(false);
    }
  }, [albums, validationResult]);

  const handleDownloadFile = React.useCallback(() => {
    if (validationResult && !validationResult.isValid) {
      toast.error("Please fix validation errors before downloading");
      return;
    }

    try {
      const code = CodeExporter.exportToTypeScript(albums);
      const filename = `albums-export-${new Date().toISOString().split('T')[0]}.ts`;
      CodeExporter.downloadAsFile(code, filename);
      toast.success("TypeScript file downloaded!");
    } catch (error) {
      toast.error("Failed to download file");
    }
  }, [albums, validationResult]);

  const generatedCode = React.useMemo(() => {
    return CodeExporter.exportToTypeScript(albums);
  }, [albums]);

  return (
    <div className="border-2 border-black bg-white">
      <div className="p-4 md:p-6 border-b border-black/10">
        <div className="flex items-center gap-3">
          <FileCode size={20} />
          <h3 className="text-lg font-black tracking-tighter">Export Data</h3>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <p className="text-[12px] opacity-70">
          Export your current album data as TypeScript code to update the source files.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isValidating ? (
              <>
                <span className="animate-spin">⏳</span>
                VALIDATING...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                VALIDATE
              </>
            )}
          </button>

          <button
            onClick={handleCopyCode}
            disabled={isCopying || (validationResult && !validationResult.isValid)}
            className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isCopying ? (
              <>
                <span className="animate-spin">⏳</span>
                COPYING...
              </>
            ) : (
              <>
                <Copy size={14} />
                COPY CODE
              </>
            )}
          </button>

          <button
            onClick={handleDownloadFile}
            disabled={validationResult && !validationResult.isValid}
            className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Download size={14} />
            DOWNLOAD FILE
          </button>
        </div>

        {validationResult && (
          <div className={`p-4 border ${validationResult.isValid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            {validationResult.errors.length > 0 && (
              <div className="space-y-2 mb-3">
                <h4 className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                  <AlertCircle size={14} />
                  Errors:
                </h4>
                <ul className="list-disc list-inside text-[11px] text-red-600 space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-yellow-700 flex items-center gap-1">
                  <AlertCircle size={14} />
                  Warnings:
                </h4>
                <ul className="list-disc list-inside text-[11px] text-yellow-700 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.isValid && validationResult.warnings.length === 0 && (
              <div className="text-[11px] text-green-700 flex items-center gap-1">
                <CheckCircle2 size={14} />
                All data is valid and ready for export!
              </div>
            )}
          </div>
        )}

        <div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-[10px] font-bold tracking-[0.2em] uppercase underline opacity-60 hover:opacity-100 transition-opacity"
          >
            {showCode ? 'HIDE CODE PREVIEW' : 'SHOW CODE PREVIEW'}
          </button>

          {showCode && (
            <div className="mt-3 p-3 bg-gray-100 border border-gray-300 overflow-auto max-h-96">
              <pre className="text-[10px] leading-relaxed font-mono whitespace-pre">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200">
          <h4 className="text-[11px] font-bold text-blue-800 mb-2">How to update the source files:</h4>
          <ol className="list-decimal list-inside text-[11px] text-blue-700 space-y-1">
            <li>Click "VALIDATE" to check your data</li>
            <li>Click "COPY CODE" to copy the TypeScript code</li>
            <li>Open <code>src/app/data/albums.ts</code> in your editor</li>
            <li>Replace the <code>initialAlbums</code> array with the copied code</li>
            <li>Commit and push the changes to GitHub</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
