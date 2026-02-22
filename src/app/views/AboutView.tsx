import * as React from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { saveScrollPosition, restoreScrollPosition } from "../utils/scrollPosition";

const ADMIN_PASSWORD = "1";

export const AboutView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAdminInput, setShowAdminInput] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [clickCount, setClickCount] = React.useState(0);
  const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const goHome = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleTitleClick = React.useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
    
    if (clickCount + 1 >= 2) {
      setShowAdminInput(true);
      setClickCount(0);
    }
  }, [clickCount]);

  const handlePasswordSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      navigate("/admin");
    } else {
      setError("Incorrect password");
      setPassword("");
      setTimeout(() => setError(""), 2000);
    }
  }, [password, navigate]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAdminInput) {
          setShowAdminInput(false);
          setPassword("");
          setError("");
        } else {
          goHome();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goHome, showAdminInput]);

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

  React.useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-8 md:p-12 relative">
      {/* Top Navigation */}
      <header className="flex justify-between items-start w-full relative z-20 mb-16">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity">JOVAN ®</Link>
        <nav className="flex gap-10">
          <Link to="/stories" className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all after:content-[''] after:block after:h-px after:w-0 hover:after:w-full after:bg-black after:transition-all ${location.pathname === '/stories' ? 'opacity-50' : ''}`}>Stories</Link>
          <Link to="/orbit" className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all after:content-[''] after:block after:h-px after:w-0 hover:after:w-full after:bg-black after:transition-all ${location.pathname === '/orbit' ? 'opacity-50' : ''}`}>Orbit</Link>
          <Link to="/about" className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all after:content-[''] after:block after:h-px after:w-0 hover:after:w-full after:bg-black after:transition-all ${location.pathname === '/about' ? 'opacity-50' : ''}`}>About</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 
            className="text-[6vw] md:text-[4vw] font-black leading-none tracking-tighter lowercase mb-12 cursor-default select-none"
            onClick={handleTitleClick}
          >
            About
          </h1>
          
          <div className="space-y-8">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl leading-relaxed"
            >
              Every photograph is a ray of light that time leaves behind in this world, a way for me to capture those fleeting yet eternal moments. Where light and shadow meet, we encounter another version of ourselves.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-lg leading-relaxed opacity-80"
            >
              I believe that what truly matters is not what you see, but what you feel. These photographs are not answers, but questions waiting to be heard.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-8 border-t border-black/10"
            >
              <p className="text-[10px] opacity-40 uppercase tracking-widest">
                &mdash; Let moments become eternity
              </p>
            </motion.div>

            {/* Admin Access */}
            {showAdminInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-8"
              >
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 max-w-xs">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 bg-white border border-black/20 text-sm focus:outline-none focus:border-black/50"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="text-[10px] font-black tracking-[0.3em] uppercase hover:opacity-50 transition-opacity"
                    >
                      [ Enter ]
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminInput(false);
                        setPassword("");
                        setError("");
                      }}
                      className="text-[10px] font-black tracking-[0.3em] uppercase hover:opacity-50 transition-opacity"
                    >
                      [ Cancel ]
                    </button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-red-600 uppercase tracking-widest"
                    >
                      {error}
                    </motion.p>
                  )}
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

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
