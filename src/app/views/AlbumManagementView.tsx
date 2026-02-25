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
import { CollapsibleSection } from "../components/CollapsibleSection";
import { Navbar } from "../components/Navbar";
import { isCloudinaryConfigured, UploadResult } from "../utils/cloudinary";
import { toast } from "sonner";
import { Upload, Edit2, GripVertical, Save, X, Download, FileUp, Move, FolderOpen, Cloud, FileCode } from "lucide-react";

interface DragState {
  draggedPhotoId: string | null;
  draggedOverPhotoId: string | null;
  draggedPhotoAlbumId: string | null;
  draggedOverAlbumId: string | null;
}

// 优化：提取PhotoItem组件，使用React.memo避免不必要的重渲染
const PhotoItem = React.memo(({ 
  photo, 
  albumId, 
  isReordering, 
  isMovingMode,
  isSelected,
  isDraggedOver,
  isDragged,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onClick,
  onEdit,
  onDelete
}: { 
  photo: Photo;
  albumId: string;
  isReordering: boolean;
  isMovingMode: boolean;
  isSelected: boolean;
  isDraggedOver: boolean;
  isDragged: boolean;
  onDragStart: (photoId: string, albumId: string) => void;
  onDragOver: (e: React.DragEvent, photoId: string) => void;
  onDrop: (albumId: string, photoId: string) => void;
  onDragEnd: () => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  return (
    <div 
      className={`relative aspect-square group will-change-transform ${
        isReordering ? 'cursor-move' : ''
      } ${
        isDraggedOver ? 'ring-2 ring-blue-500' : ''
      } ${
        isDragged ? 'opacity-50' : ''
      } ${
        isSelected ? 'ring-2 ring-yellow-500' : ''
      }`}
      draggable={isReordering}
      onDragStart={() => onDragStart(photo.id, albumId)}
      onDragOver={(e) => onDragOver(e, photo.id)}
      onDrop={() => onDrop(albumId, photo.id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <ImageWithFallback
        src={photo.url}
        alt={photo.name}
        className="w-full h-full object-cover"
        maxRetries={1}
        onLoad={() => setIsLoaded(true)}
      />
      {isReordering && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
          <GripVertical size={24} className="text-white" />
        </div>
      )}
      {isMovingMode && !isSelected && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
          <span className="text-white text-[10px] font-black opacity-0 group-hover:opacity-100">SELECT</span>
        </div>
      )}
      {isSelected && (
        <div className="absolute inset-0 bg-yellow-500/50 flex items-center justify-center pointer-events-none">
          <span className="text-white text-[10px] font-black">SELECTED</span>
        </div>
      )}
      {!isReordering && !isMovingMode && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="bg-white text-black text-[10px] font-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
            >
              EDIT
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="bg-red-500 text-white text-[10px] font-black px-3 py-1 hover:bg-red-600 transition-colors"
            >
              DELETE
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

PhotoItem.displayName = 'PhotoItem';

// 优化：提取AlbumCard组件
const AlbumCard = React.memo(({
  album,
  isReorderingAlbums,
  isMovingPhotoMode,
  selectedPhotoFromAlbumId,
  dragState,
  editingAlbumId,
  reorderingPhotoAlbumId,
  onEditAlbum,
  onDeleteAlbum,
  onOpenUpload,
  onToggleReorderPhotos,
  onAlbumDragStart,
  onAlbumDragOver,
  onAlbumDrop,
  onAlbumDragEnd,
  onMovePhotoToAlbum,
  onPhotoDragStart,
  onPhotoDragOver,
  onPhotoDrop,
  onPhotoDragEnd,
  onSelectPhotoToMove,
  onNavigateToPhoto,
  onEditPhoto,
  onDeletePhoto,
  editAlbumTitle,
  editAlbumDescription,
  editAlbumErrors,
  hasUnsavedChanges,
  onEditAlbumTitleChange,
  onEditAlbumDescriptionChange,
  onSaveAlbumChanges,
  onCancelEditAlbum
}: {
  album: Album;
  isReorderingAlbums: boolean;
  isMovingPhotoMode: boolean;
  selectedPhotoFromAlbumId: string | null;
  dragState: DragState;
  editingAlbumId: string | null;
  reorderingPhotoAlbumId: string | null;
  onEditAlbum: (album: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
  onOpenUpload: (albumId: string) => void;
  onToggleReorderPhotos: (albumId: string) => void;
  onAlbumDragStart: (albumId: string) => void;
  onAlbumDragOver: (e: React.DragEvent, albumId: string) => void;
  onAlbumDrop: (albumId: string) => void;
  onAlbumDragEnd: () => void;
  onMovePhotoToAlbum: (albumId: string) => void;
  onPhotoDragStart: (photoId: string, albumId: string) => void;
  onPhotoDragOver: (e: React.DragEvent, photoId: string) => void;
  onPhotoDrop: (albumId: string, photoId: string) => void;
  onPhotoDragEnd: () => void;
  onSelectPhotoToMove: (photo: Photo, albumId: string) => void;
  onNavigateToPhoto: (photo: Photo) => void;
  onEditPhoto: (albumId: string, photo: Photo) => void;
  onDeletePhoto: (albumId: string, photoId: string) => void;
  editAlbumTitle?: string;
  editAlbumDescription?: string;
  editAlbumErrors?: { title?: string; description?: string };
  hasUnsavedChanges?: boolean;
  onEditAlbumTitleChange?: (value: string) => void;
  onEditAlbumDescriptionChange?: (value: string) => void;
  onSaveAlbumChanges?: () => void;
  onCancelEditAlbum?: () => void;
}) => {
  const isEditing = editingAlbumId === album.id;
  const isReorderingPhotos = reorderingPhotoAlbumId === album.id;
  const isDraggedOver = dragState.draggedOverAlbumId === album.id;
  const isDragged = dragState.draggedPhotoAlbumId === album.id;
  const isSelectedSource = selectedPhotoFromAlbumId === album.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-2 bg-white will-change-transform ${
        isReorderingAlbums ? 'cursor-move' : ''
      } ${
        isDraggedOver ? 'ring-2 ring-blue-500 border-blue-500' : 'border-black'
      } ${
        isDragged ? 'opacity-50' : ''
      } ${
        isSelectedSource ? 'ring-2 ring-yellow-500' : ''
      }`}
      draggable={isReorderingAlbums}
      onDragStart={() => onAlbumDragStart(album.id)}
      onDragOver={(e) => onAlbumDragOver(e, album.id)}
      onDrop={() => onAlbumDrop(album.id)}
      onDragEnd={onAlbumDragEnd}
    >
      {/* Album Header */}
      <div className="p-4 md:p-6 border-b-2 border-black">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Album Title</label>
              <input
                type="text"
                value={editAlbumTitle || ''}
                onChange={(e) => onEditAlbumTitleChange?.(e.target.value)}
                className={`w-full border-2 ${editAlbumErrors?.title ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black min-h-[44px]`}
                maxLength={100}
              />
              {editAlbumErrors?.title && (
                <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{editAlbumErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Description</label>
              <textarea
                value={editAlbumDescription || ''}
                onChange={(e) => onEditAlbumDescriptionChange?.(e.target.value)}
                rows={3}
                className={`w-full border-2 ${editAlbumErrors?.description ? 'border-red-500' : 'border-black'} px-4 py-3 text-[13px] focus:outline-none focus:border-black resize-y min-h-[80px]`}
                maxLength={500}
              />
              {editAlbumErrors?.description && (
                <p className="text-red-500 text-[10px] mt-2 uppercase tracking-[0.1em]">{editAlbumErrors.description}</p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onSaveAlbumChanges}
                className="text-[10px] font-black tracking-[0.3em] uppercase bg-black text-white px-6 py-3 hover:opacity-80 transition-opacity flex items-center gap-2 min-h-[44px]"
              >
                <Save size={14} />
                [ SAVE ]
              </button>
              <button
                onClick={onCancelEditAlbum}
                className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <X size={14} />
                [ CANCEL ]
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isReorderingAlbums && (
                  <GripVertical size={20} className="text-gray-400 flex-shrink-0" />
                )}
                <h3 className="text-xl md:text-2xl font-black tracking-tighter">{album.title}</h3>
              </div>
              <p className="text-[13px] opacity-60 mb-4">{album.description}</p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] opacity-40 uppercase tracking-[0.2em]">
                <span>{album.photos.length} Photos</span>
                <span>Created {album.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {!isReorderingAlbums && !isMovingPhotoMode && (
                <>
                  <button
                    onClick={() => onEditAlbum(album)}
                    className="text-[10px] font-black tracking-[0.2em] uppercase border-2 border-black px-3 md:px-4 py-2 hover:bg-black hover:text-white transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    <Edit2 size={14} />
                    <span className="hidden md:inline">[ EDIT ]</span>
                    <span className="md:hidden">EDIT</span>
                  </button>
                  <button
                    onClick={() => onOpenUpload(album.id)}
                    disabled={!isCloudinaryConfigured()}
                    className="text-[10px] font-black tracking-[0.2em] uppercase border-2 border-black px-3 md:px-4 py-2 hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                  >
                    <Upload size={14} />
                    <span className="hidden md:inline">[ UPLOAD ]</span>
                    <span className="md:hidden">UPLOAD</span>
                  </button>
                  <button
                    onClick={() => onDeleteAlbum(album.id)}
                    className="text-[10px] font-black tracking-[0.2em] uppercase text-red-500 border-2 border-red-500 px-3 md:px-4 py-2 hover:bg-red-500 hover:text-white transition-colors min-h-[44px]"
                  >
                    <span className="hidden md:inline">[ DELETE ]</span>
                    <span className="md:hidden">DELETE</span>
                  </button>
                </>
              )}
              {isMovingPhotoMode && selectedPhotoFromAlbumId !== album.id && (
                <button
                  onClick={() => onMovePhotoToAlbum(album.id)}
                  className="text-[10px] font-black tracking-[0.2em] uppercase bg-blue-500 text-white px-3 md:px-4 py-2 hover:bg-blue-600 transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  <FolderOpen size={14} />
                  MOVE HERE
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Album Photos */}
      {album.photos.length > 0 && !isReorderingAlbums && (
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Photos</span>
            {!isMovingPhotoMode && (
              <button
                onClick={() => onToggleReorderPhotos(album.id)}
                className={`text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 border-2 transition-colors min-h-[44px] ${
                  isReorderingPhotos 
                    ? 'bg-black text-white border-black' 
                    : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                {isReorderingPhotos ? '[ DONE ]' : '[ REORDER ]'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {album.photos.map((photo) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                albumId={album.id}
                isReordering={isReorderingPhotos}
                isMovingMode={isMovingPhotoMode}
                isSelected={isSelectedSource && false}
                isDraggedOver={dragState.draggedOverPhotoId === photo.id}
                isDragged={dragState.draggedPhotoId === photo.id}
                onDragStart={onPhotoDragStart}
                onDragOver={onPhotoDragOver}
                onDrop={onPhotoDrop}
                onDragEnd={onPhotoDragEnd}
                onClick={() => {
                  if (isMovingPhotoMode && !isReorderingPhotos) {
                    onSelectPhotoToMove(photo, album.id);
                  } else if (!isMovingPhotoMode && !isReorderingPhotos) {
                    onNavigateToPhoto(photo);
                  }
                }}
                onEdit={() => onEditPhoto(album.id, photo)}
                onDelete={() => onDeletePhoto(album.id, photo.id)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
});

AlbumCard.displayName = 'AlbumCard';

export const AlbumManagementView = () => {
  const { albums, addAlbum, updateAlbum, deleteAlbum, addPhotosToAlbum, updatePhoto, deletePhoto, reorderPhotos, reorderAlbums, movePhotoToAlbum } = useAlbums();
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
  const [reorderingAlbumsMode, setReorderingAlbumsMode] = React.useState(false);
  const [movingPhotoMode, setMovingPhotoMode] = React.useState(false);
  const [selectedPhotoToMove, setSelectedPhotoToMove] = React.useState<{ photo: Photo; fromAlbumId: string } | null>(null);
  const [dragState, setDragState] = React.useState<DragState>({
    draggedPhotoId: null,
    draggedOverPhotoId: null,
    draggedPhotoAlbumId: null,
    draggedOverAlbumId: null
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // 优化：使用useMemo缓存验证函数结果
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
    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null, draggedPhotoAlbumId: null, draggedOverAlbumId: null });
  }, []);

  const toggleAlbumsReorderMode = React.useCallback(() => {
    setReorderingAlbumsMode(prev => !prev);
    setMovingPhotoMode(false);
    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null, draggedPhotoAlbumId: null, draggedOverAlbumId: null });
  }, []);

  const toggleMovingPhotoMode = React.useCallback(() => {
    setMovingPhotoMode(prev => !prev);
    setReorderingAlbumsMode(false);
    setSelectedPhotoToMove(null);
  }, []);

  const selectPhotoToMove = React.useCallback((photo: Photo, fromAlbumId: string) => {
    setSelectedPhotoToMove({ photo, fromAlbumId });
  }, []);

  const movePhotoToTargetAlbum = React.useCallback((toAlbumId: string) => {
    if (!selectedPhotoToMove) return;
    if (selectedPhotoToMove.fromAlbumId === toAlbumId) {
      toast.error("Cannot move photo to the same album");
      return;
    }

    if (confirm(`Move "${selectedPhotoToMove.photo.name}" to this album?`)) {
      movePhotoToAlbum(selectedPhotoToMove.photo.id, selectedPhotoToMove.fromAlbumId, toAlbumId);
      toast.success("Photo moved successfully!");
      setSelectedPhotoToMove(null);
      setMovingPhotoMode(false);
    }
  }, [selectedPhotoToMove, movePhotoToAlbum]);

  const handleDragStart = React.useCallback((photoId: string, albumId: string) => {
    setDragState(prev => ({ 
      ...prev, 
      draggedPhotoId: photoId,
      draggedPhotoAlbumId: albumId 
    }));
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

    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null, draggedPhotoAlbumId: null, draggedOverAlbumId: null });
  }, [albums, dragState.draggedPhotoId, reorderPhotos]);

  const handleAlbumDragStart = React.useCallback((albumId: string) => {
    setDragState(prev => ({ ...prev, draggedPhotoAlbumId: albumId }));
  }, []);

  const handleAlbumDragOver = React.useCallback((e: React.DragEvent, albumId: string) => {
    e.preventDefault();
    setDragState(prev => ({ ...prev, draggedOverAlbumId: albumId }));
  }, []);

  const handleAlbumDrop = React.useCallback((targetAlbumId: string) => {
    if (!dragState.draggedPhotoAlbumId || dragState.draggedPhotoAlbumId === targetAlbumId) {
      setDragState({ draggedPhotoId: null, draggedOverPhotoId: null, draggedPhotoAlbumId: null, draggedOverAlbumId: null });
      return;
    }

    const albumIds = albums.map(a => a.id);
    const draggedIndex = albumIds.indexOf(dragState.draggedPhotoAlbumId);
    const targetIndex = albumIds.indexOf(targetAlbumId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedAlbumId] = albumIds.splice(draggedIndex, 1);
      albumIds.splice(targetIndex, 0, draggedAlbumId);
      
      reorderAlbums(albumIds);
      toast.success("Album order updated!");
    }

    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null, draggedPhotoAlbumId: null, draggedOverAlbumId: null });
  }, [albums, dragState.draggedPhotoAlbumId, reorderAlbums]);

  const handleDragEnd = React.useCallback(() => {
    setDragState({ draggedPhotoId: null, draggedOverPhotoId: null, draggedPhotoAlbumId: null, draggedOverAlbumId: null });
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
      <Navbar showAlbumsLink />

      <div className="flex-1 max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Album Management</h1>
            <p className="text-[13px] opacity-60">Create and manage your photo albums</p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={exportData}
              className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <Download size={14} />
              <span className="hidden sm:inline">[ EXPORT ]</span>
              <span className="sm:hidden">EXPORT</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-colors flex items-center gap-2 min-h-[44px]"
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
              className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-colors min-h-[44px]"
            >
              {showCreateForm ? "[ CLOSE ]" : "[ NEW ALBUM ]"}
            </button>
          </div>
        </div>

        <div className="mb-8 p-4 border-2 border-black bg-white">
          <h3 className="text-sm font-black tracking-tighter mb-4">Advanced Operations</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleAlbumsReorderMode}
              className={`text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 border-2 transition-colors min-h-[44px] flex items-center gap-2 ${
                reorderingAlbumsMode 
                  ? 'bg-black text-white border-black' 
                  : 'border-black hover:bg-black hover:text-white'
              }`}
            >
              <GripVertical size={14} />
              {reorderingAlbumsMode ? '[ DONE ]' : '[ REORDER ALBUMS ]'}
            </button>
            <button
              onClick={toggleMovingPhotoMode}
              className={`text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 border-2 transition-colors min-h-[44px] flex items-center gap-2 ${
                movingPhotoMode 
                  ? 'bg-black text-white border-black' 
                  : 'border-black hover:bg-black hover:text-white'
              }`}
            >
              <Move size={14} />
              {movingPhotoMode ? '[ CANCEL MOVE ]' : '[ MOVE PHOTOS ]'}
            </button>
          </div>
          
          {movingPhotoMode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200">
              <p className="text-[11px] text-blue-800">
                <strong>Mode:</strong> Move photos between albums
                {selectedPhotoToMove ? (
                  <span className="block mt-1">
                    Selected: "{selectedPhotoToMove.photo.name}"
                  </span>
                ) : (
                  <span className="block mt-1">Click on a photo to select it</span>
                )}
              </p>
            </div>
          )}
          
          {reorderingAlbumsMode && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200">
              <p className="text-[11px] text-green-800">
                <strong>Mode:</strong> Drag and drop albums to reorder them
              </p>
            </div>
          )}
        </div>

        {!isCloudinaryConfigured() && (
          <div className="mb-8">
            <CloudinaryConfigCheck />
          </div>
        )}

        <div className="mb-8">
          <CollapsibleSection 
            title="Cloud Sync" 
            icon={<Cloud size={20} />}
            storageKey="cloudSync"
            defaultExpanded={false}
          >
            <SyncSettings />
          </CollapsibleSection>
        </div>

        <div className="mb-8">
          <CollapsibleSection 
            title="Export Data" 
            icon={<FileCode size={20} />}
            storageKey="dataExport"
            defaultExpanded={false}
          >
            <DataExport albums={albums} />
          </CollapsibleSection>
        </div>

        <AnimatePresence>
          {showCreateForm && (
            <motion.form
              onSubmit={createAlbum}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
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
                  className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-colors min-h-[44px]"
                >
                  [ CANCEL ]
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid gap-8">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              isReorderingAlbums={reorderingAlbumsMode}
              isMovingPhotoMode={movingPhotoMode}
              selectedPhotoFromAlbumId={selectedPhotoToMove?.fromAlbumId || null}
              dragState={dragState}
              editingAlbumId={editingAlbum?.id || null}
              reorderingPhotoAlbumId={reorderingAlbumId}
              onEditAlbum={startEditAlbum}
              onDeleteAlbum={handleDeleteAlbum}
              onOpenUpload={openUploadModal}
              onToggleReorderPhotos={toggleReorderMode}
              onAlbumDragStart={handleAlbumDragStart}
              onAlbumDragOver={handleAlbumDragOver}
              onAlbumDrop={(albumId) => {
                if (reorderingAlbumsMode) {
                  handleAlbumDrop(albumId);
                } else if (movingPhotoMode && selectedPhotoToMove) {
                  movePhotoToTargetAlbum(albumId);
                }
              }}
              onAlbumDragEnd={handleDragEnd}
              onMovePhotoToAlbum={movePhotoToTargetAlbum}
              onPhotoDragStart={handleDragStart}
              onPhotoDragOver={handleDragOver}
              onPhotoDrop={handleDrop}
              onPhotoDragEnd={handleDragEnd}
              onSelectPhotoToMove={selectPhotoToMove}
              onNavigateToPhoto={navigateToPhoto}
              onEditPhoto={startEditPhoto}
              onDeletePhoto={handleDeletePhoto}
              editAlbumTitle={editAlbumTitle}
              editAlbumDescription={editAlbumDescription}
              editAlbumErrors={editAlbumErrors}
              hasUnsavedChanges={hasUnsavedChanges}
              onEditAlbumTitleChange={(value) => { setEditAlbumTitle(value); setHasUnsavedChanges(true); setEditAlbumErrors(prev => ({ ...prev, title: undefined })); }}
              onEditAlbumDescriptionChange={(value) => { setEditAlbumDescription(value); setHasUnsavedChanges(true); setEditAlbumErrors(prev => ({ ...prev, description: undefined })); }}
              onSaveAlbumChanges={saveAlbumChanges}
              onCancelEditAlbum={cancelEditAlbum}
            />
          ))}

          {albums.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-black/30">
              <p className="text-[13px] opacity-40">No albums yet. Create your first album!</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showUploadModal && uploadingAlbumId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
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

      <AnimatePresence>
        {editingPhoto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
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
                    maxRetries={1}
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
                    className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors flex-1 min-h-[44px]"
                  >
                    [ CANCEL ]
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
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
                  className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors flex-1 min-h-[44px]"
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
