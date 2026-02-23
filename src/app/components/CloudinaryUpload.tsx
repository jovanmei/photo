import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  validateFile,
  UploadProgress,
  UploadResult,
  UploadError,
  isCloudinaryConfigured,
  UPLOAD_CONFIG,
} from "../utils/cloudinary";
import { Button } from "./UI";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: UploadProgress;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  result?: UploadResult;
}

interface CloudinaryUploadProps {
  albumId: string;
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: UploadError) => void;
  maxFiles?: number;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  albumId,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
}) => {
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [configError, setConfigError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Check configuration on mount
  React.useEffect(() => {
    if (!isCloudinaryConfigured()) {
      setConfigError(
        "Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET environment variables."
      );
    }
  }, []);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadFile[] = [];

    Array.from(selectedFiles).forEach((file) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        newFiles.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          progress: { loaded: 0, total: file.size, percentage: 0 },
          status: "error",
          error: validation.error,
        });
        return;
      }

      newFiles.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        progress: { loaded: 0, total: file.size, percentage: 0 },
        status: "pending",
      });
    });

    setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Remove file from list
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Update file progress
  const updateFileProgress = (id: string, progress: UploadProgress) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, progress, status: "uploading" } : f))
    );
  };

  // Update file success
  const updateFileSuccess = (id: string, result: UploadResult) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "success", result, progress: { ...f.progress, percentage: 100 } } : f
      )
    );
  };

  // Update file error
  const updateFileError = (id: string, error: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "error", error } : f))
    );
  };

  // Upload all files
  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const pendingFiles = files.filter((f) => f.status === "pending");
    const results: UploadResult[] = [];

    for (const fileData of pendingFiles) {
      try {
        const result = await uploadToCloudinary(
          fileData.file,
          `photo-gallery/${albumId}`,
          (progress) => updateFileProgress(fileData.id, progress)
        );

        updateFileSuccess(fileData.id, result);
        results.push(result);
      } catch (error) {
        const errorMessage = error instanceof UploadError ? error.message : "Upload failed";
        updateFileError(fileData.id, errorMessage);

        if (error instanceof UploadError && onUploadError) {
          onUploadError(error);
        }
      }
    }

    setIsUploading(false);

    if (results.length > 0 && onUploadComplete) {
      onUploadComplete(results);
    }
  };

  // Clear all files
  const clearAll = () => {
    setFiles([]);
  };

  // Get status icon
  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <ImageIcon className="w-4 h-4 opacity-40" />;
    }
  };

  if (configError) {
    return (
      <div className="p-6 border border-red-200 bg-red-50 rounded-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Configuration Error</h4>
            <p className="text-sm text-red-600 mt-1">{configError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-sm p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-black bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-400"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={UPLOAD_CONFIG.allowedFormats.map((f) => `.${f}`).join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <motion.div
          initial={false}
          animate={{ scale: isDragging ? 1.05 : 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
            <Upload className="w-5 h-5 opacity-60" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragging ? "Drop files here" : "Click or drag files to upload"}
            </p>
            <p className="text-xs opacity-40 mt-1">
              Supports: {UPLOAD_CONFIG.allowedFormats.join(", ").toUpperCase()} • Max{" "}
              {UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB per file
            </p>
          </div>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-40 uppercase tracking-widest">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={clearAll}
                className="text-xs opacity-40 hover:opacity-100 transition-opacity"
              >
                Clear all
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`
                    flex items-center gap-3 p-3 border rounded-sm
                    ${file.status === "error" ? "border-red-200 bg-red-50" : "border-neutral-100"}
                  `}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs opacity-40">{formatFileSize(file.size)}</p>

                    {/* Progress Bar */}
                    {file.status === "uploading" && (
                      <div className="mt-2">
                        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-black"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress.percentage}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs opacity-40 mt-1">
                          {file.progress.percentage}%
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {file.status === "error" && file.error && (
                      <p className="text-xs text-red-500 mt-1">{file.error}</p>
                    )}

                    {/* Success Message */}
                    {file.status === "success" && (
                      <p className="text-xs text-green-600 mt-1">Upload complete</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="flex-shrink-0 p-1 hover:bg-neutral-100 rounded transition-colors"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4 opacity-40" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {files.length > 0 && files.some((f) => f.status === "pending") && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
          variant="solid"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.filter((f) => f.status === "pending").length} file
              {files.filter((f) => f.status === "pending").length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default CloudinaryUpload;
