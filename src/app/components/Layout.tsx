import * as React from "react";
import { Link, useLocation } from "react-router";
import { Button, cn } from "./UI";
import { Menu, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Header = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = isAdmin 
    ? [
        { label: "DASHBOARD", path: "/admin" },
        { label: "MY ALBUMS", path: "/admin/albums" },
        { label: "VIEW SITE", path: "/" },
      ]
    : [
        { label: "STORIES", path: "/" },
        { label: "PORTFOLIO", path: "/portfolio" },
        { label: "INFO", path: "/info" },
        { label: "ADMIN", path: "/admin" },
      ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-black/5">
      <div className="flex items-center gap-12">
        <Link to="/" className="text-xl tracking-tighter font-bold">CAPTURE.</Link>
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "text-[10px] tracking-widest transition-opacity hover:opacity-100",
                location.pathname === item.path ? "opacity-100" : "opacity-40"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {isAdmin && (
          <Link to="/admin/upload">
            <Button className="hidden md:flex gap-2">
              <Plus size={14} />
              UPLOAD
            </Button>
          </Link>
        )}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-black/5 p-8 flex flex-col gap-6 md:hidden"
          >
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="text-xs tracking-widest opacity-60 hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin/upload" onClick={() => setIsOpen(false)}>
                <Button className="w-full flex justify-center gap-2">
                  <Plus size={14} />
                  UPLOAD
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => (
  <footer className="px-6 py-12 md:px-12 md:py-24 border-t border-black/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
    <div className="flex flex-col gap-4">
      <span className="text-[10px] tracking-widest opacity-40">CAPTURE ARCHIVE</span>
      <p className="text-sm max-w-xs leading-relaxed text-neutral-500">
        A minimalist platform for high-end editorial photography and management.
      </p>
    </div>
    <div className="flex flex-col md:items-end gap-2">
      <div className="flex gap-4">
        <span className="text-[10px] tracking-widest opacity-40 hover:opacity-100 cursor-pointer">INSTAGRAM</span>
        <span className="text-[10px] tracking-widest opacity-40 hover:opacity-100 cursor-pointer">TWITTER</span>
      </div>
      <span className="text-[10px] tracking-widest opacity-40">© 2026 CAPTURE PROJECT</span>
    </div>
  </footer>
);

export const PageLayout = ({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) => {
  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans selection:bg-black selection:text-white">
      <Header isAdmin={isAdmin} />
      <main className="pt-24 md:pt-32 pb-12">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};
