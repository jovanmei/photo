import * as React from "react";
import { Link, useLocation } from "react-router";

interface NavbarProps {
  showAlbumsLink?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  rightElement?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  showAlbumsLink = false,
  showCloseButton = false,
  onClose,
  rightElement,
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:opacity-50 transition-all";
    const activeClass = isActive(path) ? "opacity-50" : "";
    return `${baseClasses} ${activeClass}`;
  };

  return (
    <header className="flex flex-row md:flex-row justify-between items-center w-full gap-4 md:gap-4 pt-4 md:pt-0 mb-4 md:mb-8 lg:mb-12">
      <Link 
        to="/" 
        className="text-base md:text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity leading-none"
      >
        JOVAN ®
      </Link>
      
      <nav className="flex items-center gap-6 md:gap-10 flex-shrink-0">
        <Link 
          to="/stories" 
          className={getLinkClassName('/stories')}
        >
          Stories
        </Link>
        <Link 
          to="/orbit" 
          className={getLinkClassName('/orbit')}
        >
          Orbit
        </Link>
        <Link 
          to="/about" 
          className={getLinkClassName('/about')}
        >
          About
        </Link>
        
        {showAlbumsLink && (
          <Link 
            to="/admin" 
            className={getLinkClassName('/admin')}
          >
            Albums
          </Link>
        )}
        
        {showCloseButton && onClose && (
          <button 
            onClick={onClose}
            className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:opacity-50 transition-all cursor-pointer"
            aria-label="Close"
            role="button"
          >
            [ CLOSE ]
          </button>
        )}
        
        {rightElement}
      </nav>
    </header>
  );
};
