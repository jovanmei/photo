import { Album } from '../data/albums';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const DataValidator = {
  validateAlbums: (albums: Album[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!albums || !Array.isArray(albums)) {
      errors.push('Albums must be an array');
      return { isValid: false, errors, warnings };
    }

    if (albums.length === 0) {
      warnings.push('No albums found');
    }

    const albumIds = new Set<string>();
    const photoIds = new Set<string>();

    albums.forEach((album, albumIndex) => {
      if (!album.id || typeof album.id !== 'string') {
        errors.push(`Album ${albumIndex + 1}: Invalid or missing id`);
      } else if (albumIds.has(album.id)) {
        errors.push(`Album ${albumIndex + 1}: Duplicate id "${album.id}"`);
      } else {
        albumIds.add(album.id);
      }

      if (!album.title || typeof album.title !== 'string') {
        errors.push(`Album ${albumIndex + 1}: Invalid or missing title`);
      } else if (album.title.length < 2) {
        warnings.push(`Album ${albumIndex + 1}: Title is very short`);
      } else if (album.title.length > 100) {
        errors.push(`Album ${albumIndex + 1}: Title exceeds 100 characters`);
      }

      if (!album.displayTitle || typeof album.displayTitle !== 'string') {
        errors.push(`Album ${albumIndex + 1}: Invalid or missing displayTitle`);
      }

      if (!album.description || typeof album.description !== 'string') {
        errors.push(`Album ${albumIndex + 1}: Invalid or missing description`);
      }

      if (!album.createdAt || !(album.createdAt instanceof Date)) {
        errors.push(`Album ${albumIndex + 1}: Invalid or missing createdAt`);
      }

      if (!album.photos || !Array.isArray(album.photos)) {
        errors.push(`Album ${albumIndex + 1}: Photos must be an array`);
      } else {
        album.photos.forEach((photo, photoIndex) => {
          if (!photo.id || typeof photo.id !== 'string') {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Invalid or missing id`);
          } else if (photoIds.has(photo.id)) {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Duplicate id "${photo.id}"`);
          } else {
            photoIds.add(photo.id);
          }

          if (!photo.url || typeof photo.url !== 'string') {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Invalid or missing url`);
          } else if (!photo.url.startsWith('http://') && !photo.url.startsWith('https://')) {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: URL must start with http:// or https://`);
          }

          if (!photo.name || typeof photo.name !== 'string') {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Invalid or missing name`);
          }

          if (photo.description !== undefined && typeof photo.description !== 'string') {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Description must be a string`);
          }

          if (photo.location !== undefined && typeof photo.location !== 'string') {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Location must be a string`);
          }

          if (!photo.uploadDate || !(photo.uploadDate instanceof Date)) {
            errors.push(`Album ${albumIndex + 1}, Photo ${photoIndex + 1}: Invalid or missing uploadDate`);
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};

export const CodeExporter = {
  exportToTypeScript: (albums: Album[]): string => {
    const formatDate = (date: Date): string => {
      return `new Date("${date.toISOString().split('T')[0]}")`;
    };

    const formatPhoto = (photo: any, indent: string): string => {
      let result = `${indent}{\n`;
      result += `${indent}  id: "${photo.id}",\n`;
      result += `${indent}  url: "${photo.url}",\n`;
      result += `${indent}  name: "${photo.name.replace(/"/g, '\\"')}",\n`;
      
      if (photo.description) {
        result += `${indent}  description: "${photo.description.replace(/"/g, '\\"')}",\n`;
      }
      
      if (photo.location) {
        result += `${indent}  location: "${photo.location.replace(/"/g, '\\"')}",\n`;
      }
      
      result += `${indent}  uploadDate: ${formatDate(photo.uploadDate)}\n`;
      result += `${indent}}`;
      
      return result;
    };

    const formatAlbum = (album: any, indent: string): string => {
      let result = `${indent}{\n`;
      result += `${indent}  id: "${album.id}",\n`;
      result += `${indent}  title: "${album.title.replace(/"/g, '\\"')}",\n`;
      result += `${indent}  displayTitle: "${album.displayTitle}",\n`;
      result += `${indent}  description: "${album.description.replace(/"/g, '\\"')}",\n`;
      result += `${indent}  createdAt: ${formatDate(album.createdAt)},\n`;
      result += `${indent}  photos: [\n`;
      
      album.photos.forEach((photo: any, index: number) => {
        result += formatPhoto(photo, `${indent}    `);
        if (index < album.photos.length - 1) {
          result += ',';
        }
        result += '\n';
      });
      
      result += `${indent}  ]\n`;
      result += `${indent}}`;
      
      return result;
    };

    let code = `export const initialAlbums: Album[] = [\n`;
    
    albums.forEach((album, index) => {
      code += formatAlbum(album, '  ');
      if (index < albums.length - 1) {
        code += ',';
      }
      code += '\n';
    });
    
    code += `];\n`;
    
    return code;
  },

  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },

  downloadAsFile: (text: string, filename: string): void => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
