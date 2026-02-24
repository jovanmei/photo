import * as React from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navbar } from "../components/Navbar";
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
      const previousPath = location.state?.from || '/stories';
      navigate(previousPath);
      setTimeout(() => {
        restoreScrollPosition(previousPath);
      }, 100);
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
      className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-4 md:p-8 lg:p-12 gap-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0.98 : 1 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* Top Header with Close Button - 桌面端 */}
      <div className="hidden md:block">
        <Navbar showCloseButton onClose={handleClose} />
      </div>

      {/* Mobile Header - 仅品牌标识 */}
      <div className="md:hidden">
        <Navbar />
      </div>

      {/* Top Layout Grid */}
      <div className="grid grid-cols-12 gap-8 items-start relative">
        {/* Left Column: Large Image */}
        <div className="col-span-12 md:col-span-8">
          {/* 移动端关闭按钮 - 图片上方靠右 */}
          <div className="md:hidden flex justify-end mb-4">
            <button 
              onClick={handleClose}
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all cursor-pointer"
              aria-label="Close"
            >
              [ CLOSE ]
            </button>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            key={currentPhoto.id}
            className="shadow-2xl"
          >
            <ImageWithFallback 
              src={currentPhoto.url} 
              alt={currentPhoto.name}
              className="w-full h-auto object-contain block"
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
                className="text-sm md:text-base uppercase tracking-widest mt-2"
              >
                {currentPhoto.location}
              </motion.span>
            )}
          </div>

          <div className="w-full text-right mt-12 flex flex-col items-end gap-6">
            <span className="text-[10px] opacity-40 uppercase tracking-widest">[ ↓ ]</span>
            <div className="flex flex-col items-end gap-4 max-w-md">
              <span className="text-[10px] opacity-40">[{currentIndex}]</span>
              <p className="text-base md:text-lg leading-relaxed">
                {currentPhoto.description || "Every photograph is a ray of light that time leaves behind in this world, a way to capture those fleeting yet eternal moments. Where light and shadow meet, we encounter another version of ourselves."}
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Navigation Footer */}
      <footer className="w-full flex justify-between items-end border-t border-black/10 pt-2 mt-4 relative z-10">
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
