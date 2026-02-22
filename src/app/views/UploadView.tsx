import * as React from "react";
import { PageLayout } from "../components/Layout";
import { Button, Input, Divider, cn } from "../components/UI";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const UPLOAD_MOCK = [
  { id: 1, url: "https://images.unsplash.com/photo-1737629918402-b6fe238e9f0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsYWNrJTIwYW5kJTIwd2hpdGUlMjB0ZXh0dXJlJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzE2ODI4MDZ8MA&ixlib=rb-4.1.0&q=80&w=400", progress: 100, status: "complete" },
  { id: 2, url: "https://images.unsplash.com/photo-1642655079124-2476f7a2963a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vY2hyb21lJTIwbWluaW1hbCUyMGxhbmRzY2FwZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzcxNjgyODAzfDA&ixlib=rb-4.1.0&q=80&w=400", progress: 65, status: "uploading" },
  { id: 3, url: "https://images.unsplash.com/photo-1755018237309-bb3f5efeb2c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJlJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NzE2NjA0MzJ8MA&ixlib=rb-4.1.0&q=80&w=400", progress: 0, status: "pending" },
];

export const UploadView = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState(UPLOAD_MOCK);

  const handleUpload = () => {
    toast.success("Photos uploaded successfully");
  };

  return (
    <PageLayout isAdmin>
      <div className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] tracking-widest opacity-40 block mb-2 uppercase">ADMINISTRATION</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">Bulk Upload</h1>
          </div>
          <Button variant="underline" onClick={() => window.history.back()}>
            BACK TO DASHBOARD
          </Button>
        </div>

        {/* Drag and Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            "relative w-full aspect-[21/9] border border-dashed flex flex-col items-center justify-center gap-6 transition-all cursor-pointer group mb-12",
            isDragging ? "bg-black/5 border-black" : "border-black/10 hover:border-black"
          )}
        >
          <div className="w-16 h-16 flex items-center justify-center border border-black/10 group-hover:scale-110 transition-transform">
            <Upload size={24} strokeWidth={1} />
          </div>
          <div className="text-center">
            <span className="text-xs tracking-widest font-bold uppercase mb-2 block">DRAG & DROP PHOTOS</span>
            <span className="text-[10px] tracking-widest opacity-40 uppercase">OR CLICK TO BROWSE FILES</span>
          </div>
          <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        {/* Uploading List */}
        <div className="space-y-12">
          <div className="flex justify-between items-center border-b border-black/5 pb-4">
            <h2 className="text-xs tracking-widest font-bold uppercase flex items-center gap-2">
              UPLOADING QUEUE
              <span className="text-[10px] opacity-40">({files.length} ITEMS)</span>
            </h2>
            <Button variant="solid" onClick={handleUpload}>SAVE ALL CHANGES</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {files.map((file) => (
              <div key={file.id} className="space-y-4">
                <div className="aspect-[4/5] relative bg-neutral-50 overflow-hidden border border-black/5">
                  <ImageWithFallback 
                    src={file.url} 
                    className={cn(
                      "w-full h-full object-cover filter grayscale transition-opacity duration-500",
                      file.status === "uploading" ? "opacity-40" : "opacity-100"
                    )}
                  />
                  
                  {file.status === "uploading" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px]">
                      <Loader2 className="animate-spin mb-4" size={24} />
                      <div className="w-32 h-[1px] bg-black/10 relative">
                        <motion.div 
                          className="absolute inset-0 bg-black h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] tracking-widest font-bold mt-2 uppercase">{file.progress}%</span>
                    </div>
                  )}

                  {file.status === "complete" && (
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 border border-black/5">
                      <Check size={14} />
                    </div>
                  )}

                  <button className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur p-2 border border-black/5">
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-6 pt-4">
                  <div>
                    <span className="text-[9px] tracking-[0.2em] opacity-40 mb-2 block uppercase font-bold">Photo Title</span>
                    <Input placeholder="Untitled Asset" className="border-black/5 focus:border-black/40" />
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.2em] opacity-40 mb-2 block uppercase font-bold">Metadata / Description</span>
                    <Textarea placeholder="Add description..." className="min-h-[60px] border-black/5 focus:border-black/40" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold">Status</span>
                    <span className={cn(
                      "text-[9px] tracking-[0.2em] font-bold uppercase",
                      file.status === "complete" ? "text-black" : "text-neutral-400 animate-pulse"
                    )}>
                      {file.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
