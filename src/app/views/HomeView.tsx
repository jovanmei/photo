import * as React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SoundWaveIcon } from "../components/SoundWaveIcon";
import { Navbar } from "../components/Navbar";
import { useAudio } from "../context/AudioContext";

export const HomeView = () => {
  const navigate = useNavigate();
  const { isPlaying, togglePlay } = useAudio();

  const goToStories = React.useCallback(() => {
    navigate("/stories");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Header - 桌面端显示音波图标，移动端不显示 */}
      <Navbar rightElement={<div className="hidden md:block"><SoundWaveIcon isPlaying={isPlaying} onClick={togglePlay} /></div>} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-4 mt-6 md:mt-12 relative">
        {/* Left Image Column - 移动端放在文字上方 */}
        <div className="w-full md:col-span-4 lg:col-span-3 z-10 order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="aspect-square bg-neutral-200 overflow-hidden max-w-[200px] md:max-w-none mx-auto md:mx-0"
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1760484701050-88c541f587e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGhvcnNlJTIwZm9nZ3l8ZW58MXx8fHwxNzcxNjg0MTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Intro Horse"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Right Text Column */}
        <div className="w-full md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9 flex flex-col gap-4 z-10 mt-4 md:mt-0 order-2">
          <div className="flex gap-4 items-start">
            <p className="text-sm md:text-[14px] leading-relaxed max-w-sm">
              I'm not great with words. That's why I take photos. Every image here has a story. Someone I met, a place I walked through, a moment I didn't expect but couldn't let pass. This is more than a portfolio. It's what I want to remember, and maybe, what you'll feel something from too.
            </p>
          </div>
        </div>

        {/* 移动端音波图标 - 放在Capture上方 */}
        <div className="w-full flex justify-center mt-6 md:hidden order-3">
          <SoundWaveIcon isPlaying={isPlaying} onClick={togglePlay} />
        </div>

        {/* Capture Component - 移动端放在文字下方，桌面端绝对定位 */}
        <div className="w-full flex flex-col items-end mt-2 md:mt-0 md:absolute md:bottom-0 md:right-0 md:left-0 md:pointer-events-none z-0 order-4">
          <div className="hidden md:flex items-center gap-4 md:gap-12 w-full justify-between mb-2 md:mb-4">
             <div className="flex gap-4 md:gap-8 text-[10px] opacity-40">
             </div>
             <div className="h-[40px] md:h-[60px] w-px bg-black/10"></div>
          </div>
          <div className="relative w-full text-right">
             <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-[15vw] md:text-[15vw] font-black leading-[0.8] tracking-tighter lowercase select-none"
             >
                capture
             </motion.h2>
             <div className="flex justify-between items-end mt-2 md:mt-4">
                <span className="text-[10px] opacity-40 tracking-widest">////</span>
                <span className="text-[10px] opacity-40 tracking-widest uppercase">moment</span>
             </div>
          </div>
        </div>

        {/* Explore Component - 移动端放在Capture下方 */}
        <div className="w-full flex justify-center mt-20 mb-8 md:mt-0 md:mb-0 md:absolute md:bottom-8 md:left-2/10 md:transform md:-translate-x-1/2 z-20 order-5">
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
      </main>
    </div>
  );
};
