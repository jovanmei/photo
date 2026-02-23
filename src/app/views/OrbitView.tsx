import * as React from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import { useAlbums } from "../context/AlbumContext";
import { saveScrollPosition, restoreScrollPosition } from "../utils/scrollPosition";

export const OrbitView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { albums } = useAlbums();

  const goHome = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') goHome();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goHome]);

  React.useEffect(() => {
    restoreScrollPosition(location.pathname);
    
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      saveScrollPosition(location.pathname);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-4 md:p-8 lg:p-12 relative">
      {/* Top Navigation */}
      <Navbar />

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="text-[6vw] md:text-[4vw] font-black leading-none tracking-tighter lowercase">Orbit</h1>
        <p className="text-[10px] opacity-40 mt-4 tracking-widest uppercase">Album overview</p>
      </motion.div>

      {/* Album Grid */}
      <div className="flex flex-col gap-16 items-center">
        {albums.map((album, index) => {
          const coverPhoto = album.photos.length > 0 ? album.photos[0] : null;
          
          return (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col md:flex-row items-center gap-10 max-w-4xl w-full"
              onClick={() => navigate('/stories', { state: { selectedAlbumIndex: index } })}
            >
              <div className="w-[50vw] md:w-[25vw] aspect-square bg-neutral-200 overflow-hidden shadow-2xl flex-shrink-0 relative">
                {coverPhoto && (
                  <ImageWithFallback
                    src={coverPhoto.url}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="flex flex-col gap-3 flex-1 max-w-lg">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter lowercase truncate">
                  {album.title}
                </h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">
                  {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
                </p>
                {album.description && (
                  <p className="text-base opacity-60 line-clamp-3">
                    {album.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {albums.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center flex-1"
        >
          <p className="text-[10px] opacity-40 uppercase tracking-widest">No albums yet</p>
        </motion.div>
      )}

      {/* Footer Markers */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
        <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-80"></span>
        <button 
          onClick={goHome}
          className="text-[10px] font-black tracking-[0.4em] uppercase opacity-80 hover:opacity-100 hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 px-2 py-1"
          aria-label="Return to home"
        >
          WILDLIFE
        </button>
      </div>
    </div>
  );
};
