import * as React from "react";
import { PageLayout } from "../components/Layout";
import { Button, Input, Textarea, Divider } from "../components/UI";
import { Plus, Image as ImageIcon, Folders, Settings, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const AlbumModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white border border-black/5 p-12 z-[101] shadow-2xl"
          >
            <div className="flex justify-between items-start mb-12">
              <h2 className="text-2xl font-bold tracking-tight">CREATE ALBUM</h2>
              <button onClick={onClose} className="opacity-40 hover:opacity-100"><X size={20} /></button>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] tracking-widest opacity-40 mb-2 block uppercase">ALBUM NAME</label>
                <Input placeholder="Enter album name..." />
              </div>
              <div>
                <label className="text-[10px] tracking-widest opacity-40 mb-2 block uppercase">ALBUM DESCRIPTION</label>
                <Textarea placeholder="Describe the collection..." className="min-h-[120px]" />
              </div>
              <Button 
                variant="solid" 
                className="w-full"
                onClick={() => {
                  toast.success("Album created successfully");
                  onClose();
                }}
              >
                CREATE ALBUM
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const DashboardView = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const stats = [
    { label: "TOTAL PHOTOS", value: "128" },
    { label: "TOTAL ALBUMS", value: "12" },
    { label: "TOTAL VIEWS", value: "2.4K" },
  ];

  const recentAlbums = [
    { id: 1, name: "URBAN FORMS", count: 24, date: "21.02.26", img: "https://images.unsplash.com/photo-1755018237309-bb3f5efeb2c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJlJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NzE2NjA0MzJ8MA&ixlib=rb-4.1.0&q=80&w=200" },
    { id: 2, name: "NATURE ABSTRACT", count: 18, date: "15.02.26", img: "https://images.unsplash.com/photo-1642655079124-2476f7a2963a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vY2hyb21lJTIwbWluaW1hbCUyMGxhbmRzY2FwZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzcxNjgyODAzfDA&ixlib=rb-4.1.0&q=80&w=200" },
    { id: 3, name: "STUDIO SHOTS", count: 42, date: "08.02.26", img: "https://images.unsplash.com/photo-1737629918402-b6fe238e9f0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsYWNrJTIwYW5kJTIwd2hpdGUlMjB0ZXh0dXJlJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzE2ODI4MDZ8MA&ixlib=rb-4.1.0&q=80&w=200" },
  ];

  return (
    <PageLayout isAdmin>
      <div className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] tracking-widest opacity-40 block mb-2">ADMINISTRATION</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">DASHBOARD</h1>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={14} className="mr-2" />
              CREATE ALBUM
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 border-y border-black/5 py-12">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-[10px] tracking-widest opacity-40 block mb-2 uppercase">{stat.label}</span>
              <span className="text-4xl font-light tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs tracking-widest font-bold flex items-center gap-2 uppercase">
                <Folders size={14} />
                RECENT ALBUMS
              </h2>
              <Button variant="underline">VIEW ALL</Button>
            </div>
            <div className="space-y-4">
              {recentAlbums.map((album) => (
                <div key={album.id} className="group border-b border-black/5 py-4 flex justify-between items-center hover:bg-neutral-50 px-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 overflow-hidden">
                      <ImageWithFallback src={album.img} className="w-full h-full object-cover filter grayscale" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest font-bold block mb-1 uppercase">{album.name}</span>
                      <span className="text-[10px] tracking-widest opacity-40 uppercase">{album.count} PHOTOS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] tracking-widest opacity-40 uppercase">{album.date}</span>
                    <Button variant="underline" className="opacity-0 group-hover:opacity-100">EDIT</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs tracking-widest font-bold flex items-center gap-2 uppercase">
                <Settings size={14} />
                QUICK ACTIONS
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/admin/upload">
                <div className="p-8 border border-black/5 hover:border-black transition-colors flex flex-col items-center gap-4 cursor-pointer group">
                  <div className="w-12 h-12 flex items-center justify-center border border-black/10 group-hover:bg-black group-hover:text-white transition-colors">
                    <ImageIcon size={20} />
                  </div>
                  <span className="text-[10px] tracking-widest font-bold uppercase">BULK PHOTO UPLOAD</span>
                </div>
              </Link>
              <div className="p-8 border border-black/5 hover:border-black transition-colors flex flex-col items-center gap-4 cursor-pointer group">
                <div className="w-12 h-12 flex items-center justify-center border border-black/10 group-hover:bg-black group-hover:text-white transition-colors">
                  <LogOut size={20} />
                </div>
                <span className="text-[10px] tracking-widest font-bold uppercase">SIGNOUT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlbumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageLayout>
  );
};
