import * as React from "react";
import { Album, Photo, initialAlbums, saveAlbumsToStorage, loadAlbumsFromStorage } from "../data/albums";

interface AlbumContextType {
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  addAlbum: (album: Album) => void;
  updateAlbum: (albumId: string, updates: Partial<Album>) => void;
  deleteAlbum: (albumId: string) => void;
  addPhotosToAlbum: (albumId: string, photos: Photo[]) => void;
  updatePhoto: (albumId: string, photoId: string, updates: Partial<Photo>) => void;
  deletePhoto: (albumId: string, photoId: string) => void;
  reorderPhotos: (albumId: string, photoIds: string[]) => void;
}

export const AlbumContext = React.createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [albums, setAlbums] = React.useState<Album[]>(() => {
    return loadAlbumsFromStorage();
  });

  React.useEffect(() => {
    saveAlbumsToStorage(albums);
  }, [albums]);

  const addAlbum = React.useCallback((album: Album) => {
    setAlbums(prev => [...prev, album]);
  }, []);

  const updateAlbum = React.useCallback((albumId: string, updates: Partial<Album>) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return { ...album, ...updates };
      }
      return album;
    }));
  }, []);

  const deleteAlbum = React.useCallback((albumId: string) => {
    setAlbums(prev => prev.filter(a => a.id !== albumId));
  }, []);

  const addPhotosToAlbum = React.useCallback((albumId: string, photos: Photo[]) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return { ...album, photos: [...album.photos, ...photos] };
      }
      return album;
    }));
  }, []);

  const updatePhoto = React.useCallback((albumId: string, photoId: string, updates: Partial<Photo>) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          photos: album.photos.map(p => 
            p.id === photoId ? { ...p, ...updates } : p
          )
        };
      }
      return album;
    }));
  }, []);

  const deletePhoto = React.useCallback((albumId: string, photoId: string) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return { ...album, photos: album.photos.filter(p => p.id !== photoId) };
      }
      return album;
    }));
  }, []);

  const reorderPhotos = React.useCallback((albumId: string, photoIds: string[]) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        const photoMap = new Map(album.photos.map(p => [p.id, p]));
        const reorderedPhotos = photoIds
          .map(id => photoMap.get(id))
          .filter((p): p is Photo => p !== undefined);
        return { ...album, photos: reorderedPhotos };
      }
      return album;
    }));
  }, []);

  return (
    <AlbumContext.Provider value={{ 
      albums, 
      setAlbums, 
      addAlbum, 
      updateAlbum,
      deleteAlbum, 
      addPhotosToAlbum, 
      updatePhoto, 
      deletePhoto,
      reorderPhotos 
    }}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbums = () => {
  const context = React.useContext(AlbumContext);
  if (context === undefined) {
    throw new Error('useAlbums must be within an AlbumProvider');
  }
  return context;
};
