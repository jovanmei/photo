import * as React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SoundWaveIcon } from "../components/SoundWaveIcon";
import { useAudio } from "../context/AudioContext";

export const HomeView = () => {
  const navigate = useNavigate();
  const { isPlaying, togglePlay } = useAudio();

  const goToStories = React.useCallback(() => {
    navigate("/stories");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full relative z-20 gap-4">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity">JOVAN ®</Link>
        <nav className="flex items-center gap-4 md:gap-10">
          <Link to="/stories" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">Stories</Link>
          <Link to="/orbit" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">Orbit</Link>
          <Link to="/about" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">About</Link>
        </nav>
        {/* SoundWave Icon - Second row on mobile, inline on desktop */}
        <div className="md:hidden">
          <SoundWaveIcon isPlaying={isPlaying} onClick={togglePlay} />
        </div>
      </header>

      {/* SoundWave Icon - Desktop only, positioned absolutely */}
      <div className="hidden md:block absolute top-8 right-8 lg:right-12 z-30">
        <SoundWaveIcon isPlaying={isPlaying} onClick={togglePlay} />
      </div>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-12 gap-4 mt-6 md:mt-12 relative pb-[35vh] md:pb-0">
        {/* Left Image Column */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="aspect-square bg-neutral-200 overflow-hidden"
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1760484701050-88c541f587e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGhvcnNlJTIwZm9nZ3l8ZW58MXx8fHwxNzcxNjg0MTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Intro Horse"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Right Text Column */}
        <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9 flex flex-col gap-4 z-10 mt-4 md:mt-0">
          <div className="flex gap-4 items-start">
            <p className="text-sm md:text-[13px] leading-relaxed max-w-sm">
              I'm not great with words. That's why I take photos. Every image here has a story. Someone I met, a place I walked through, a moment I didn't expect but couldn't let pass. This is more than a portfolio. It's what I want to remember, and maybe, what you'll feel something from too.
            </p>
          </div>
        </div>

        {/* Big Background Heading */}
        <div className="absolute bottom-0 right-0 left-0 pointer-events-none flex flex-col items-end z-0">
          <div className="flex items-center gap-4 md:gap-12 w-full justify-between mb-2 md:mb-4">
             <div className="flex gap-4 md:gap-8 text-[10px] opacity-40">
             </div>
             <div className="h-[40px] md:h-[60px] w-px bg-black/10"></div>
          </div>
          <div className="relative w-full text-right">
             <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-[20vw] md:text-[15vw] font-black leading-[0.8] tracking-tighter lowercase select-none"
             >
                capture
             </motion.h2>
             <div className="flex justify-between items-end mt-2 md:mt-4">
                <span className="text-[10px] opacity-40 tracking-widest">////</span>
                <span className="text-[10px] opacity-40 tracking-widest uppercase">moment</span>
             </div>
          </div>
        </div>
      </main>

      {/* Scroll to Stories Arrow */}
      <div className="absolute bottom-4 md:bottom-8 left-1/4 md:left-1/6 transform -translate-x-1/2 flex flex-col items-center z-20">
        <motion.button
          onClick={goToStories}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.1, y: 4 }}
          whileTap={{ scale: 0.95 }}
          className="text-[10px] font-black tracking-[0.4em] uppercase flex flex-col items-center gap-2 cursor-pointer hover:opacity-60 transition-opacity"
          aria-label="Scroll to Stories section"
        >
          <span className="opacity-60">EXPLORE</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            ↓
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};
