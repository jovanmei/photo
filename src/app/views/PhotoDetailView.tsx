import * as React from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAlbums } from "../context/AlbumContext";
import { 
  getPhotoByIdFromAlbums, 
  getPhotoIndexInAlbums, 
  getPrevPhotoInAlbums, 
  getNextPhotoInAlbums,
  getAllPhotos 
} from "../data/albums";
import { restoreScrollPosition } from "../utils/scrollPosition";

export const PhotoDetailView = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const { albums } = useAlbums();
  const photoId = params.id || "p1";
  const currentPhoto = getPhotoByIdFromAlbums(albums, photoId) || getAllPhotos(albums)[0];
  const nextPhoto = getNextPhotoInAlbums(albums, photoId);
  const prevPhoto = getPrevPhotoInAlbums(albums, photoId);
  const currentIndex = getPhotoIndexInAlbums(albums, photoId);
  const totalPhotos = getAllPhotos(albums).length;
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      navigate(-1);
      const previousPath = location.state?.from || '/stories';
      setTimeout(() => {
        restoreScrollPosition(previousPath);
      }, 50);
    }, 250);
  }, [navigate, location]);

  const goHome = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  const goToPrev = React.useCallback(() => {
    navigate(`/photo/${prevPhoto.id}`);
  }, [navigate, prevPhoto]);

  const goToNext = React.useCallback(() => {
    navigate(`/photo/${nextPhoto.id}`);
  }, [navigate, nextPhoto]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, goToPrev, goToNext]);

  return (
    <motion.div 
      className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-8 md:p-12 gap-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0.98 : 1 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* Top Header with Close Button */}
      <header className="flex justify-between items-start w-full relative z-20">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity">JOVAN ®</Link>
        <div className="flex items-center gap-8">
          <button 
            onClick={goHome}
            className="text-[10px] font-black tracking-[0.3em] uppercase hover:opacity-50 transition-opacity"
            aria-label="Return to home page"
          >
            WILDLIFE
          </button>
          <button 
            onClick={handleClose}
            className="text-[10px] font-black tracking-[0.3em] uppercase hover:opacity-50 transition-opacity focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-1"
            aria-label="Close photo detail"
            role="button"
          >
            [ CLOSE ]
          </button>
        </div>
      </header>

      {/* Top Layout Grid */}
      <div className="grid grid-cols-12 gap-8 items-start relative">
        {/* Left Column: Large Image */}
        <div className="col-span-12 md:col-span-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            key={currentPhoto.id}
            className="aspect-[4/3] bg-neutral-200 grayscale overflow-hidden shadow-2xl"
          >
            <ImageWithFallback 
              src={currentPhoto.url} 
              alt={currentPhoto.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Right Column: Info & Text */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-12 items-end">
          <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-40 mb-2 uppercase tracking-widest">[{currentPhoto.uploadDate.getFullYear()}]</span>
            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter"
            >
                {String(currentIndex).padStart(2, '0')}
            </motion.h3>
            {currentPhoto.location && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.5 }}
                className="text-[10px] uppercase tracking-widest mt-2"
              >
                {currentPhoto.location}
              </motion.span>
            )}
          </div>

          <div className="w-full text-right mt-12 flex flex-col items-end gap-6">
            <span className="text-[10px] opacity-40 uppercase tracking-widest">[ ↓ ]</span>
            <div className="flex flex-col items-end gap-4 max-w-xs">
              <span className="text-[10px] opacity-40">[{currentIndex}]</span>
              <p className="text-[13px] leading-relaxed">
                Every photograph is a ray of light that time leaves behind in this world, a way to capture those fleeting yet eternal moments. Where light and shadow meet, we encounter another version of ourselves.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Image - Scrolling Content */}
      <div className="w-full">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="aspect-video bg-neutral-200 grayscale overflow-hidden shadow-2xl"
        >
          <ImageWithFallback 
            src={prevPhoto.url} 
            alt={prevPhoto.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <footer className="w-full flex justify-between items-end border-t border-black/10 pt-8 mt-32 relative z-10">
         <span className="text-[10px] font-black tracking-[0.4em] uppercase">{String(currentIndex).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}</span>
         <div className="flex gap-12 items-center">
            <button 
              onClick={goToNext}
              className="text-[10px] font-black tracking-[0.4em] uppercase hover:opacity-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-1"
              aria-label="Next photo"
            >
              NEXT
            </button>
            <span className="text-[10px] opacity-20">/</span>
            <button 
              onClick={goToPrev}
              className="text-[10px] font-black tracking-[0.4em] uppercase hover:opacity-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-1"
              aria-label="Previous photo"
            >
              PREV
            </button>
         </div>
      </footer>
    </motion.div>
  );
};
