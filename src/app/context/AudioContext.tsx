import * as React from "react";

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

export const AudioContext = React.createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const togglePlay = React.useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source 
          src="/Soft Edges Of The Unknown - Peace.mp3" 
          type="audio/mpeg" 
        />
        Your browser does not support the audio element.
      </audio>
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = React.useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
