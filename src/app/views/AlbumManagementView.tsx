import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Album, Photo, generateId } from "../data/albums";
import { useAlbums } from "../context/AlbumContext";
import { CloudinaryUpload } from "../components/CloudinaryUpload";
import { CloudinaryConfigCheck } from "../components/CloudinaryConfigCheck";
import { isCloudinaryConfigured, UploadResult } from "../utils/cloudinary";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export const AlbumManagementView = () => {
  const { albums, addAlbum, deleteAlbum, addPhotosToAlbum, updatePhoto, deletePhoto } = useAlbums();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = React.useState("");
  const [newAlbumDescription, setNewAlbumDescription] = React.useState("");
  const [errors, setErrors] = React.useState<{ title?: string; description?: string; files?: string }>({});
  const [selectedAlbum, setSelectedAlbum] = React.useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadingAlbumId, setUploadingAlbumId] = React.useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = React.useState<{ albumId: string; photo: Photo } | null>(null);
  const [editPhotoName, setEditPhotoName] = React.useState("");
  const [editPhotoDescription, setEditPhotoDescription] = React.useState("");
  const [editPhotoLocation, setEditPhotoLocation] = React.useState("");
  const [showSaveConfirm, setShowSaveConfirm] = React.useState(false);
  const [previewPhoto, setPreviewPhoto] = React.useState<Photo | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateForm = React.useCallback(() => {
    const newErrors: { title?: string; description?: string } = {};
    if (!newAlbumTitle.trim()) {
      newErrors.title = "Album title is required";
    } else if (newAlbumTitle.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }
    if (!newAlbumDescription.trim()) {
      newErrors.description = "Album description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newAlbumTitle, newAlbumDescription]);

  const createAlbum = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newAlbum: Album = {
      id: generateId(),
      title: newAlbumTitle.trim(),
      displayTitle: newAlbumTitle.trim().toLowerCase().replace(/\s+/g, ''),
      description: newAlbumDescription.trim(),
      createdAt: new Date(),
      photos: []
    };

    addAlbum(newAlbum);
    setNewAlbumTitle("");
    setNewAlbumDescription("");
    setShowCreateForm(false);
    setErrors({});
  }, [newAlbumTitle, newAlbumDescription, validateForm, addAlbum]);

  const handleDeleteAlbum = React.useCallback((albumId: string) => {
    if (confirm("Are you sure you want to delete this album? This action cannot be undone.")) {
      deleteAlbum(albumId);
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
    toast.error(error.message || "Upload failed");
  }, []);

  const handleDeletePhoto = React.useCallback((albumId: string, photoId: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhoto(albumId, photoId);
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
    setShowSaveConfirm(true);
  }, [editingPhoto]);

  const confirmSave = React.useCallback(() => {
    if (!editingPhoto || !editPhotoName.trim()) return;
    
    updatePhoto(editingPhoto.albumId, editingPhoto.photo.id, { 
      name: editPhotoName.trim(),
      description: editPhotoDescription.trim(),
      location: editPhotoLocation.trim() || undefined,
    });
    
    setEditingPhoto(null);
    setShowSaveConfirm(false);
  }, [editingPhoto, editPhotoName, editPhotoDescription, editPhotoLocation, updatePhoto]);

  const cancelEdit = React.useCallback(() => {
    setEditingPhoto(null);
    setShowSaveConfirm(false);
  }, []);

  const openPreview = React.useCallback((photo: Photo) => {
    setPreviewPhoto(photo);
  }, []);

  const closePreview = React.useCallback(() => {
    setPreviewPhoto(null);
  }, []);

  const navigateToPhoto = React.useCallback((photo: Photo) => {
    window.location.hash = `#/photo/${photo.id}`;
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans flex flex-col p-8 md:p-12">
      {/* Header */}
      <header className="flex justify-between items-start w-full mb-12">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity">JOVAN ®</Link>
        <nav className="flex gap-10">
          <Link to="/stories" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">Stories</Link>
          <Link to="/orbit" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">Orbit</Link>
          <Link to="/about" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">About</Link>
          <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Albums</Link>
        </nav>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Album Management</h1>
            <p className="text-[13px] opacity-60">Create and manage your photo albums</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all"
          >
            {showCreateForm ? "[ CLOSE ]" : "[ NEW ALBUM ]"}
          </button>
        </div>

        {/* Cloudinary Configuration Check */}
        {!isCloudinaryConfigured() && (
          <div className="mb-8">
            <CloudinaryConfigCheck />
          </div>
        )}

        {/* Create Album Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.form
              onSubmit={createAlbum}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-2 border-black p-8 mb-8 bg-white"
            >
              <h2 className="text-xl font-black tracking-tighter mb-6">Create New Album</h2>
              
              <div className="grid gap-6 mb-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Album Title</label>
                  <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    className={`w-full border-2 ${errors.title ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black`}
                    placeholder="Enter album title..."
                  />
                  {errors.title && (
                    <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Description</label>
                  <textarea
                    value={newAlbumDescription}
                    onChange={(e) => setNewAlbumDescription(e.target.value)}
                    rows={4}
                    className={`w-full border-2 ${errors.description ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black resize-none`}
                    placeholder="Describe your album..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{errors.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-8 py-3 hover:opacity-80 transition-opacity"
                >
                  [ CREATE ]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setErrors({});
                  }}
                  className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-all"
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
              <div className="p-6 border-b-2 border-black">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black tracking-tighter mb-2">{album.title}</h3>
                    <p className="text-[13px] opacity-60 mb-4">{album.description}</p>
                    <div className="flex items-center gap-6 text-[10px] opacity-40 uppercase tracking-[0.2em]">
                      <span>{album.photos.length} Photos</span>
                      <span>Created {album.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 ml-8">
                    <button
                      onClick={() => openUploadModal(album.id)}
                      disabled={!isCloudinaryConfigured()}
                      className="text-[10px] font-black tracking-[0.2em] uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Upload size={14} />
                      [ UPLOAD ]
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="text-[10px] font-black tracking-[0.2em] uppercase text-red-500 border-2 border-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-all"
                    >
                      [ DELETE ]
                    </button>
                  </div>
                </div>
              </div>

              {/* Album Photos */}
              {album.photos.length > 0 && (
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {album.photos.map((photo) => (
                      <div key={photo.id} className="relative aspect-square group">
                        <ImageWithFallback
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => navigateToPhoto(photo)}
                        />
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
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tighter">Upload Photos</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-2xl font-black hover:opacity-50 transition-opacity"
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
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black tracking-tighter">Edit Photo</h2>
                  <button
                    onClick={cancelEdit}
                    className="text-2xl font-black hover:opacity-50 transition-opacity"
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
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Photo Name</label>
                    <input
                      type="text"
                      value={editPhotoName}
                      onChange={(e) => setEditPhotoName(e.target.value)}
                      className="w-full border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Location (Optional)</label>
                    <input
                      type="text"
                      value={editPhotoLocation}
                      onChange={(e) => setEditPhotoLocation(e.target.value)}
                      className="w-full border-2 border-black px-4 py-3 text-[13px] focus:outline-none focus:border-black"
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
                    className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity flex-1"
                  >
                    [ SAVE ]
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all flex-1"
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
              className="bg-white border-2 border-black p-8 max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-black tracking-tighter mb-4">Confirm Save</h2>
              <p className="text-[13px] opacity-60 mb-6">Are you sure you want to save these changes?</p>
              
              <div className="flex gap-4">
                <button
                  onClick={confirmSave}
                  className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity flex-1"
                >
                  [ YES ]
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all flex-1"
                >
                  [ NO ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 text-white text-2xl font-black hover:opacity-70 transition-opacity z-10"
              >
                ×
              </button>
              <ImageWithFallback
                src={previewPhoto.url}
                alt={previewPhoto.name}
                className="w-full max-h-[80vh] object-contain"
              />
              <p className="text-white text-center mt-4 text-[13px]">{previewPhoto.name}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumManagementView;
