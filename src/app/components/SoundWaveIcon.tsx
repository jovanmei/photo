import * as React from "react";
import { motion } from "motion/react";

interface SoundWaveIconProps {
  isPlaying: boolean;
  onClick: () => void;
}

export const SoundWaveIcon: React.FC<SoundWaveIconProps> = ({ isPlaying, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="flex items-center gap-1 hover:opacity-50 transition-opacity focus:outline-none"
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
    >
      <div className="flex items-end gap-[2px] h-3">
        <motion.div
          className="w-0.5 bg-black"
          animate={{
            height: isPlaying ? [4, 12, 8, 10, 4] : 6
          }}
          transition={{
            duration: 0.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="w-0.5 bg-black"
          animate={{
            height: isPlaying ? [8, 4, 12, 6, 8] : 10
          }}
          transition={{
            duration: 0.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.1
          }}
        />
        <motion.div
          className="w-0.5 bg-black"
          animate={{
            height: isPlaying ? [6, 10, 4, 12, 6] : 8
          }}
          transition={{
            duration: 0.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        <motion.div
          className="w-0.5 bg-black"
          animate={{
            height: isPlaying ? [10, 6, 8, 4, 10] : 12
          }}
          transition={{
            duration: 0.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
      </div>
    </button>
  );
};
