import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Album, Photo, generateId, saveAlbumsToStorage } from "../data/albums";
import { useAlbums } from "../context/AlbumContext";
import { CloudinaryUpload } from "../components/CloudinaryUpload";
import { CloudinaryConfigCheck } from "../components/CloudinaryConfigCheck";
import { SyncSettings } from "../components/SyncSettings";
import { DataExport } from "../components/DataExport";
import { isCloudinaryConfigured, UploadResult } from "../utils/cloudinary";
import { toast } from "sonner";
import { Upload, Edit2, GripVertical, Save, X, Download, FileUp } from "lucide-react";

interface DragState {
  draggedPhotoId: string | null;
  draggedOverPhotoId: string | null;
}

export const AlbumManagementView = () => {
  const { albums, addAlbum, updateAlbum, deleteAlbum, addPhotosToAlbum, updatePhoto, deletePhoto, reorderPhotos } = useAlbums();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = React.useState("");
  const [newAlbumDescription, setNewAlbumDescription] = React.useState("");
  const [errors, setErrors] = React.useState<{ title?: string; description?: string }>({});
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadingAlbumId, setUploadingAlbumId] = React.useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = React.useState<{ albumId: string; photo: Photo } | null>(null);
  const [editPhotoName, setEditPhotoName] = React.useState("");
  const [editPhotoDescription, setEditPhotoDescription] = React.useState("");
  const [editPhotoLocation, setEditPhotoLocation] = React.useState("");
  const [showSaveConfirm, setShowSaveConfirm] = React.useState(false);
  const [editingAlbum, setEditingAlbum] = React.useState<Album | null>(null);
  const [editAlbumTitle, setEditAlbumTitle] = React.useState("");
  const [editAlbumDescription, setEditAlbumDescription] = React.useState("");
  const [editAlbumErrors, setEditAlbumErrors] = React.useState<{ title?: string; description?: string }>({});
  const [reorderingAlbumId, setReorderingAlbumId] = React.useState<string | null>(null);
  const [dragState, setDragState] = React.useState<DragState>({
    draggedPhotoId: null,
    draggedOverPhotoId: null
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const validateForm = React.useCallback((title: string, description: string) => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    return newErrors;
  }, []);

  const createAlbum = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(newAlbumTitle, newAlbumDescription);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const newAlbum: Album = {
      id: generateId(),
      title: newAlbumTitle.trim(),
      displayTitle: newAlbumTitle.trim().toLowerCase().replace(/\s+/g, ''),
      description: newAlbumDescription.trim(),
      createdAt: new Date(),
      photos: []
    };

    addAlbum(newAlbum);
    toast.success("Album created successfully!");
    setNewAlbumTitle("");
    setNewAlbumDescription("");
    setShowCreateForm(false);
    setErrors({});
  }, [newAlbumTitle, newAlbumDescription, validateForm, addAlbum]);

  const handleDeleteAlbum = React.useCallback((albumId: string) => {
    if (confirm("Are you sure you want to delete this album? This action cannot be undone.")) {
      deleteAlbum(albumId);
      toast.success("Album deleted successfully!");
    }
  }, [deleteAlbum]);

  const openUploadModal = React.useCallback((albumId: string) => {
    setUploadingAlbumId(albumId);
    setShowUploadModal(true);
  }, []);

  const handleUploadComplete = React.useCallback((results: UploadResult[]) => {
    if (!uploadingAlbumId) return;

    const newPhotos: Photo[] = results.map((result) => ({
      id: generateId(),
      url: result.secure_url,
      name: result.original_filename,
      uploadDate: new Date(result.created_at),
    }));

    addPhotosToAlbum(uploadingAlbumId, newPhotos);
    toast.success(`Successfully uploaded ${results.length} photo(s)`);
    setShowUploadModal(false);
    setUploadingAlbumId(null);
  }, [uploadingAlbumId, addPhotosToAlbum]);

  const handleUploadError = React.useCallback((error: any) => {
    console.error("Upload error:", error);
    toast.error(error.message || "Upload failed. Please try again.");
  }, []);

  const handleDeletePhoto = React.useCallback((albumId: string, photoId: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhoto(albumId, photoId);
      toast.success("Photo deleted successfully!");
    }
  }, [deletePhoto]);

  const startEditPhoto = React.useCallback((albumId: string, photo: Photo) => {
    setEditingPhoto({ albumId, photo });
    setEditPhotoName(photo.name);
    setEditPhotoDescription(photo.description || '');
    setEditPhotoLocation(photo.location || '');
  }, []);

  const saveEditPhoto = React.useCallback(() => {
    if (!editingPhoto) return;
    if (!editPhotoName.trim()) {
      toast.error("Photo name is required");
      return;
    }
    setShowSaveConfirm(true);
  }, [editingPhoto, editPhotoName]);

  const confirmSave = React.useCallback(() => {
    if (!editingPhoto || !editPhotoName.trim()) return;
    
    updatePhoto(editingPhoto.albumId, editingPhoto.photo.id, { 
      name: editPhotoName.trim(),
      description: editPhotoDescription.trim(),
      location: editPhotoLocation.trim() || undefined,
    });
    
    toast.success("Photo updated successfully!");
    setEditingPhoto(null);
    setShowSaveConfirm(false);
  }, [editingPhoto, editPhotoName, editPhotoDescription, editPhotoLocation, updatePhoto]);

  const cancelEdit = React.useCallback(() => {
    setEditingPhoto(null);
    setShowSaveConfirm(false);
  }, []);

  const navigateToPhoto = React.useCallback((photo: Photo) => {
    window.location.hash = `#/photo/${photo.id}`;
  }, []);

  const startEditAlbum = React.useCallback((album: Album) => {
    setEditingAlbum(album);
    setEditAlbumTitle(album.title);
    setEditAlbumDescription(album.description);
    setEditAlbumErrors({});
    setHasUnsavedChanges(false);
  }, []);

  const cancelEditAlbum = React.useCallback(() => {
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        return;
      }
    }
    setEditingAlbum(null);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  const saveAlbumChanges = React.useCallback(() => {
    if (!editingAlbum) return;
    
    const formErrors = validateForm(editAlbumTitle, editAlbumDescription);
    if (Object.keys(formErrors).length > 0) {
      setEditAlbumErrors(formErrors);
      return;
    }

    updateAlbum(editingAlbum.id, {
      title: editAlbumTitle.trim(),
      displayTitle: editAlbumTitle.trim().toLowerCase().replace(/\s+/g, ''),
      description: editAlbumDescription.trim(),
    });

    toast.success("Album updated successfully!");
    setEditingAlbum(null);
    setHasUnsavedChanges(false);
  }, [editingAlbum, editAlbumTitle, editAlbumDescription, validateForm, updateAlbum]);

  const toggleReorderMode = React.useCallback((albumId: string) => {
    setReorderingAlbumId(prev => prev === albumId ? null : albumId);
    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null });
  }, []);

  const handleDragStart = React.useCallback((photoId: string) => {
    setDragState(prev => ({ ...prev, draggedPhotoId: photoId }));
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent, photoId: string) => {
    e.preventDefault();
    setDragState(prev => ({ ...prev, draggedOverPhotoId: photoId }));
  }, []);

  const handleDrop = React.useCallback((albumId: string, targetPhotoId: string) => {
    const album = albums.find(a => a.id === albumId);
    if (!album || !dragState.draggedPhotoId) return;

    const photos = [...album.photos];
    const draggedIndex = photos.findIndex(p => p.id === dragState.draggedPhotoId);
    const targetIndex = photos.findIndex(p => p.id === targetPhotoId);

    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      const [draggedPhoto] = photos.splice(draggedIndex, 1);
      photos.splice(targetIndex, 0, draggedPhoto);
      
      const newPhotoIds = photos.map(p => p.id);
      reorderPhotos(albumId, newPhotoIds);
      toast.success("Photo order updated!");
    }

    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null });
  }, [albums, dragState.draggedPhotoId, reorderPhotos]);

  const handleDragEnd = React.useCallback(() => {
    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null });
  }, []);

  const exportData = React.useCallback(() => {
    try {
      const dataStr = JSON.stringify(albums, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photo-gallery-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export data");
    }
  }, [albums]);

  const importData = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedAlbums = JSON.parse(content) as Album[];
        
        if (!Array.isArray(importedAlbums)) {
          throw new Error('Invalid data format');
        }

        for (const album of importedAlbums) {
          if (!album.id || !album.title || !album.photos) {
            throw new Error('Invalid album structure');
          }
        }

        const processedAlbums = importedAlbums.map(album => ({
          ...album,
          createdAt: new Date(album.createdAt),
          photos: album.photos.map(photo => ({
            ...photo,
            uploadDate: new Date(photo.uploadDate)
          }))
        }));

        saveAlbumsToStorage(processedAlbums);
        window.location.reload();
        toast.success(`Imported ${processedAlbums.length} album(s) successfully!`);
      } catch (error) {
        console.error('Import error:', error);
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, []);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-4 md:p-8 lg:p-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-8 md:mb-12 gap-4">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity">JOVAN ®</Link>
        <nav className="flex gap-4 md:gap-10">
          <Link to="/stories" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">Stories</Link>
          <Link to="/orbit" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">Orbit</Link>
          <Link to="/about" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">About</Link>
          <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Albums</Link>
        </nav>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Album Management</h1>
            <p className="text-[13px] opacity-60">Create and manage your photo albums</p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={exportData}
              className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 min-h-[44px]"
            >
              <Download size={14} />
              <span className="hidden sm:inline">[ EXPORT ]</span>
              <span className="sm:hidden">EXPORT</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 min-h-[44px]"
            >
              <FileUp size={14} />
              <span className="hidden sm:inline">[ IMPORT ]</span>
              <span className="sm:hidden">IMPORT</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-all min-h-[44px]"
            >
              {showCreateForm ? "[ CLOSE ]" : "[ NEW ALBUM ]"}
            </button>
          </div>
        </div>

        {/* Cloudinary Configuration Check */}
        {!isCloudinaryConfigured() && (
          <div className="mb-8">
            <CloudinaryConfigCheck />
          </div>
        )}

        {/* Cloud Sync Settings */}
        <div className="mb-8">
          <SyncSettings />
        </div>

        {/* Data Export */}
        <div className="mb-8">
          <DataExport albums={albums} />
        </div>

        {/* Create Album Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.form
              onSubmit={createAlbum}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-2 border-black p-4 md:p-8 mb-8 bg-white"
            >
              <h2 className="text-xl font-black tracking-tighter mb-6">Create New Album</h2>
              
              <div className="grid gap-6 mb-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Album Title *</label>
                  <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => { setNewAlbumTitle(e.target.value); setErrors(prev => ({ ...prev, title: undefined })); }}
                    className={`w-full border-2 ${errors.title ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]`}
                    placeholder="Enter album title..."
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Description *</label>
                  <textarea
                    value={newAlbumDescription}
                    onChange={(e) => { setNewAlbumDescription(e.target.value); setErrors(prev => ({ ...prev, description: undefined })); }}
                    rows={4}
                    className={`w-full border-2 ${errors.description ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black resize-y min-h-[100px]`}
                    placeholder="Describe your album..."
                    maxLength={500}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{errors.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-8 py-3 hover:opacity-80 transition-opacity min-h-[44px]"
                >
                  [ CREATE ]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setErrors({});
                  }}
                  className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-all min-h-[44px]"
                >
                  [ CANCEL ]
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Albums List */}
        <div className="grid gap-8">
          {albums.map((album) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-black bg-white"
            >
              {/* Album Header */}
              <div className="p-4 md:p-6 border-b-2 border-black">
                {editingAlbum?.id === album.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Album Title</label>
                      <input
                        type="text"
                        value={editAlbumTitle}
                        onChange={(e) => { setEditAlbumTitle(e.target.value); setHasUnsavedChanges(true); setEditAlbumErrors(prev => ({ ...prev, title: undefined })); }}
                        className={`w-full border-2 ${editAlbumErrors.title ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]`}
                        maxLength={100}
                      />
                      {editAlbumErrors.title && (
                        <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{editAlbumErrors.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Description</label>
                      <textarea
                        value={editAlbumDescription}
                        onChange={(e) => { setEditAlbumDescription(e.target.value); setHasUnsavedChanges(true); setEditAlbumErrors(prev => ({ ...prev, description: undefined })); }}
                        rows={3}
                        className={`w-full border-2 ${editAlbumErrors.description ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black resize-y min-h-[80px]`}
                        maxLength={500}
                      />
                      {editAlbumErrors.description && (
                        <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{editAlbumErrors.description}</p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={saveAlbumChanges}
                        className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity flex items-center gap-2 min-h-[44px]"
                      >
                        <Save size={14} />
                        [ SAVE ]
                      </button>
                      <button
                        onClick={cancelEditAlbum}
                        className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all flex items-center gap-2 min-h-[44px]"
                      >
                        <X size={14} />
                        [ CANCEL ]
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-2">{album.title}</h3>
                      <p className="text-[13px] opacity-60 mb-4">{album.description}</p>
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] opacity-40 uppercase tracking-[0.2em]">
                        <span>{album.photos.length} Photos</span>
                        <span>Created {album.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <button
                        onClick={() => startEditAlbum(album)}
                        className="text-[10px] font-black tracking-[0.2em] uppercase border-2 border-black px-3 md:px-4 py-2 hover:bg-black hover:text-white transition-all flex items-center gap-2 min-h-[44px]"
                      >
                        <Edit2 size={14} />
                        <span className="hidden md:inline">[ EDIT ]</span>
                        <span className="md:hidden">EDIT</span>
                      </button>
                      <button
                        onClick={() => openUploadModal(album.id)}
                        disabled={!isCloudinaryConfigured()}
                        className="text-[10px] font-black tracking-[0.2em] uppercase border-2 border-black px-3 md:px-4 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                      >
                        <Upload size={14} />
                        <span className="hidden md:inline">[ UPLOAD ]</span>
                        <span className="md:hidden">UPLOAD</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album.id)}
                        className="text-[10px] font-black tracking-[0.2em] uppercase text-red-500 border-2 border-red-500 px-3 md:px-4 py-2 hover:bg-red-500 hover:text-white transition-all min-h-[44px]"
                      >
                        <span className="hidden md:inline">[ DELETE ]</span>
                        <span className="md:hidden">DELETE</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Album Photos */}
              {album.photos.length > 0 && (
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Photos</span>
                    <button
                      onClick={() => toggleReorderMode(album.id)}
                      className={`text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 border-2 transition-all min-h-[44px] ${
                        reorderingAlbumId === album.id 
                          ? 'bg-black text-white border-black' 
                          : 'border-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {reorderingAlbumId === album.id ? '[ DONE ]' : '[ REORDER ]'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {album.photos.map((photo, index) => (
                      <div 
                        key={photo.id} 
                        className={`relative aspect-square group ${
                          reorderingAlbumId === album.id ? 'cursor-move' : ''
                        } ${
                          dragState.draggedOverPhotoId === photo.id ? 'ring-2 ring-blue-500' : ''
                        } ${
                          dragState.draggedPhotoId === photo.id ? 'opacity-50' : ''
                        }`}
                        draggable={reorderingAlbumId === album.id}
                        onDragStart={() => handleDragStart(photo.id)}
                        onDragOver={(e) => handleDragOver(e, photo.id)}
                        onDrop={() => handleDrop(album.id, photo.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <ImageWithFallback
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          onClick={() => reorderingAlbumId !== album.id && navigateToPhoto(photo)}
                        />
                        {reorderingAlbumId === album.id && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <GripVertical size={24} className="text-white" />
                          </div>
                        )}
                        {reorderingAlbumId !== album.id && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); startEditPhoto(album.id, photo); }}
                                className="bg-white text-black text-[10px] font-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                              >
                                EDIT
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeletePhoto(album.id, photo.id); }}
                                className="bg-red-500 text-white text-[10px] font-black px-3 py-1 hover:bg-red-600 transition-all"
                              >
                                DELETE
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {albums.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-black/30">
              <p className="text-[13px] opacity-40">No albums yet. Create your first album!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && uploadingAlbumId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#F2F2F2] border-2 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-black tracking-tighter">Upload Photos</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-2xl font-black hover:opacity-50 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                
                <CloudinaryUpload
                  albumId={uploadingAlbumId}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  maxFiles={10}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Photo Modal */}
      <AnimatePresence>
        {editingPhoto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#F2F2F2] border-2 border-black w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-black tracking-tighter">Edit Photo</h2>
                  <button
                    onClick={cancelEdit}
                    className="text-2xl font-black hover:opacity-50 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-6">
                  <ImageWithFallback
                    src={editingPhoto.photo.url}
                    alt={editingPhoto.photo.name}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Photo Name *</label>
                    <input
                      type="text"
                      value={editPhotoName}
                      onChange={(e) => setEditPhotoName(e.target.value)}
                      className="w-full border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Location (Optional)</label>
                    <input
                      type="text"
                      value={editPhotoLocation}
                      onChange={(e) => setEditPhotoLocation(e.target.value)}
                      className="w-full border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]"
                      placeholder="e.g., Tokyo, Japan"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Photo Description</label>
                    <textarea
                      value={editPhotoDescription}
                      onChange={(e) => setEditPhotoDescription(e.target.value)}
                      rows={4}
                      className="w-full border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black resize-y min-h-[100px]"
                      placeholder="Add a description for this photo..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={saveEditPhoto}
                    className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity flex-1 min-h-[44px]"
                  >
                    [ SAVE ]
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all flex-1 min-h-[44px]"
                  >
                    [ CANCEL ]
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Confirmation Modal */}
      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border-2 border-black p-6 md:p-8 max-w-sm w-full text-center"
            >
              <h2 className="text-lg md:text-xl font-black tracking-tighter mb-4">Confirm Save</h2>
              <p className="text-[13px] opacity-60 mb-6">Are you sure you want to save these changes?</p>
              
              <div className="flex gap-4">
                <button
                  onClick={confirmSave}
                  className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity flex-1 min-h-[44px]"
                >
                  [ YES ]
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all flex-1 min-h-[44px]"
                >
                  [ NO ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumManagementView;
