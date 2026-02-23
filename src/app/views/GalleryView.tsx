import * as React from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import { useAlbums } from "../context/AlbumContext";
import { saveScrollPosition, restoreScrollPosition } from "../utils/scrollPosition";

const STORAGE_KEY = 'gallery-view-state';

export const GalleryView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { albums } = useAlbums();
  
  const [currentAlbumIndex, setCurrentAlbumIndex] = React.useState(() => {
    try {
      if (location.state?.selectedAlbumIndex !== undefined) {
        const index = location.state.selectedAlbumIndex;
        if (index >= 0 && index < albums.length) {
          return index;
        }
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.albumIndex !== undefined && parsed.albumIndex >= 0 && parsed.albumIndex < albums.length) {
          return parsed.albumIndex;
        }
      }
    } catch (e) {
      console.error('Failed to load gallery state:', e);
    }
    return 0;
  });
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(() => {
    try {
      if (location.state?.selectedAlbumIndex !== undefined) {
        return 0;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.photoIndex !== undefined) {
          return parsed.photoIndex;
        }
      }
    } catch (e) {
      console.error('Failed to load gallery state:', e);
    }
    return 0;
  });
  
  const currentAlbum = albums[currentAlbumIndex] || albums[0] || { id: "fallback", title: "Fallback", displayTitle: "fallback", description: "", createdAt: new Date(), photos: [] };
  const currentPhotos = currentAlbum.photos.length > 0 ? currentAlbum.photos : [{ id: "empty", url: "https://images.unsplash.com/photo-1628889923625-e3b33f73d780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", name: "No photos yet", uploadDate: new Date() }];
  const currentPhoto = currentPhotos[currentPhotoIndex] || currentPhotos[0];

  const handlePrevPhoto = React.useCallback(() => {
    const newIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    setCurrentPhotoIndex(newIndex);
  }, [currentPhotoIndex, currentPhotos.length]);

  const handleNextPhoto = React.useCallback(() => {
    const newIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    setCurrentPhotoIndex(newIndex);
  }, [currentPhotoIndex, currentPhotos.length]);

  const handleNextAlbum = React.useCallback(() => {
    const newIndex = (currentAlbumIndex + 1) % albums.length;
    setCurrentAlbumIndex(newIndex);
    setCurrentPhotoIndex(0);
  }, [currentAlbumIndex, albums.length]);

  const handlePrevAlbum = React.useCallback(() => {
    const newIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    setCurrentAlbumIndex(newIndex);
    setCurrentPhotoIndex(0);
  }, [currentAlbumIndex, albums.length]);

  const goHome = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') goHome();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevPhoto, handleNextPhoto, goHome]);

  React.useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          albumIndex: currentAlbumIndex,
          photoIndex: currentPhotoIndex
        }));
      } catch (e) {
        console.error('Failed to save gallery state:', e);
      }
    };
    
    saveState();
    
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
      saveState();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      saveScrollPosition(location.pathname);
      saveState();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, currentAlbumIndex, currentPhotoIndex]);

  React.useEffect(() => {
    restoreScrollPosition(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Thumbnail Row */}
      {currentAlbum.photos.length > 0 && (
        <div className="w-full flex justify-center gap-[2px] mb-8">
          {currentAlbum.photos.map((photo, i) => (
            <motion.div 
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setCurrentPhotoIndex(i)}
              className={`flex-shrink-0 w-[13%] aspect-square bg-neutral-200 overflow-hidden cursor-pointer transition-all ${i === currentPhotoIndex ? 'ring-2 ring-black ring-offset-2' : ''}`}
            >
              <ImageWithFallback 
                src={photo.url} 
                alt={photo.name}
                className="w-full h-full object-cover transition-all"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2 md:gap-8 lg:gap-16 w-full">
          <button 
            onClick={handlePrevPhoto}
            aria-label="Previous photo"
            className="text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase hover:opacity-50 transition-opacity whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-3 md:px-4 min-h-[44px] min-w-[44px] flex-shrink-0"
          >
            [ Prev ]
          </button>
          
          <motion.div 
            key={`${currentAlbumIndex}-${currentPhotoIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-[50vw] md:w-[35vw] aspect-square bg-neutral-200 overflow-hidden shadow-2xl relative flex-shrink-0"
          >
             {currentPhoto.url && (
               <Link 
                to={`/photo/${currentPhoto.id}`} 
                state={{ from: location.pathname }}
                onClick={() => saveScrollPosition(location.pathname)}
                className="block w-full h-full"
               >
                  <ImageWithFallback 
                    src={currentPhoto.url} 
                    alt={currentPhoto.name}
                    className="w-full h-full object-cover"
                  />
               </Link>
             )}
          </motion.div>

          <button 
            onClick={handleNextPhoto}
            aria-label="Next photo"
            className="text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase hover:opacity-50 transition-opacity whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-3 md:px-4 min-h-[44px] min-w-[44px] flex-shrink-0"
          >
            [ Next ]
          </button>
        </div>

        {/* Title Block with Album Name */}
        <div className="mt-16 flex flex-col items-center">
          <span className="text-[10px] font-bold opacity-40 mb-4">[ {currentPhotoIndex + 1} ]</span>
          <motion.h2 
            key={currentAlbum.displayTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onClick={goHome}
            className="text-[14vw] font-black leading-none tracking-tighter lowercase select-none cursor-pointer hover:opacity-60 transition-opacity"
            aria-label="Return to main page"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goHome(); }}
          >
            {currentAlbum.displayTitle}
          </motion.h2>
          <p className="text-[10px] opacity-40 mt-2 tracking-widest uppercase">Click to return home</p>
        </div>
      </div>

      {/* Footer Markers */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
        <button 
          onClick={handlePrevAlbum}
          className="text-[10px] font-black tracking-[0.4em] uppercase opacity-80 hover:opacity-100 hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-1"
          aria-label="Previous album"
        >
          TOP
        </button>
        <button 
          onClick={handleNextAlbum}
          className="text-[10px] font-black tracking-[0.4em] uppercase opacity-80 hover:opacity-100 hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-1"
          aria-label="Next album"
        >
          SHOT
        </button>
      </div>
    </div>
  );
};
