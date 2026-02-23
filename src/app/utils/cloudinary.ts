import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

// Cloudinary configuration
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
  url: {
    secure: true,
  },
});

// Upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  maxWidth: 4000,
  maxHeight: 4000,
};

// File validation
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !UPLOAD_CONFIG.allowedFormats.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file format. Allowed: ${UPLOAD_CONFIG.allowedFormats.join(', ')}`,
    };
  }

  return { valid: true };
};

// Upload progress type
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload result type
export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  original_filename: string;
}

// Upload error type
export class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'photo-gallery',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new UploadError(validation.error || 'Invalid file', 'VALIDATION_ERROR');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // Configure form data
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
    formData.append('resource_type', 'image');

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.error) {
            reject(new UploadError(
              response.error.message,
              response.error.code || 'UPLOAD_ERROR',
              response.error
            ));
          } else {
            resolve(response as UploadResult);
          }
        } catch (error) {
          reject(new UploadError(
            'Failed to parse upload response',
            'PARSE_ERROR',
            error
          ));
        }
      } else {
        // Handle specific error codes
        let errorMessage = `Upload failed with status ${xhr.status}`;
        let errorDetails: any = { status: xhr.status, response: xhr.responseText };
        
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse.error) {
            errorMessage = errorResponse.error.message || errorMessage;
            errorDetails = { ...errorDetails, ...errorResponse.error };
          }
        } catch (e) {
          // Response is not JSON
        }
        
        // Provide helpful messages for common errors
        if (xhr.status === 400) {
          if (!cloudName || !uploadPreset) {
            errorMessage = 'Cloudinary is not properly configured. Please check your environment variables (VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET).';
          } else if (errorMessage.includes('upload_preset')) {
            errorMessage = `Invalid upload preset: "${uploadPreset}". Please verify your upload preset name in Cloudinary dashboard.`;
          } else if (errorMessage.includes('cloud_name')) {
            errorMessage = `Invalid cloud name: "${cloudName}". Please verify your cloud name in Cloudinary dashboard.`;
          } else {
            errorMessage = `Bad request: ${errorMessage}. Please check your Cloudinary configuration.`;
          }
        }
        
        reject(new UploadError(
          errorMessage,
          'HTTP_ERROR',
          errorDetails
        ));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new UploadError(
        'Network error occurred during upload',
        'NETWORK_ERROR'
      ));
    });

    xhr.addEventListener('abort', () => {
      reject(new UploadError(
        'Upload was aborted',
        'ABORT_ERROR'
      ));
    });

    // Open and send request
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );
    xhr.send(formData);
  });
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string = 'photo-gallery',
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadToCloudinary(
      files[i],
      folder,
      onProgress ? (progress) => onProgress(i, progress) : undefined
    );
    results.push(result);
  }

  return results;
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Note: Deletion requires server-side authentication
  // This is a placeholder for the frontend to call backend API
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new UploadError(
      'Failed to delete image',
      'DELETE_ERROR',
      { status: response.status }
    );
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  let image = cld.image(publicId);

  if (width && height) {
    image = image.resize(fill().width(width).height(height));
  } else if (width) {
    image = image.resize(fill().width(width));
  } else if (height) {
    image = image.resize(fill().height(height));
  }

  return image.toURL();
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = (): boolean => {
  return !!(cloudName && uploadPreset);
};
