export interface Photo {
  id: string;
  url: string;
  name: string;
  description?: string;
  location?: string;
  uploadDate: Date;
}

export interface Album {
  id: string;
  title: string;
  displayTitle: string;
  description: string;
  createdAt: Date;
  photos: Photo[];
}

const STORAGE_KEY = 'photoGallery_albums';
const STORAGE_VERSION_KEY = 'photoGallery_version';
const CURRENT_VERSION = '2'; // Increment when data structure changes

export const initialAlbums: Album[] = [
  {
    id: "1",
    title: "Wildlife Collection",
    displayTitle: "wildlife",
    description: "A curated collection of wildlife moments captured in nature.",
    createdAt: new Date("2024-01-15"),
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1628889923625-e3b33f73d780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Panda Bamboo",
        location: "Chengdu, China",
        uploadDate: new Date("2024-01-15")
      },
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1509005084666-3cbc75184cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Dog Portrait",
        location: "Tokyo, Japan",
        uploadDate: new Date("2024-01-15")
      },
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1574068774810-a5ccb01f9620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Magical Horse",
        location: "Iceland",
        uploadDate: new Date("2024-01-15")
      }
    ]
  },
  {
    id: "2",
    title: "Urban Moments",
    displayTitle: "urban",
    description: "Streets and people from cities around the world.",
    createdAt: new Date("2024-02-20"),
    photos: [
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "City Lights",
        location: "New York, USA",
        uploadDate: new Date("2024-02-20")
      },
      {
        id: "p5",
        url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Street Photography",
        location: "London, UK",
        uploadDate: new Date("2024-02-20")
      }
    ]
  },
  {
    id: "3",
    title: "Nature Scenes",
    displayTitle: "nature",
    description: "Beautiful landscapes and natural wonders.",
    createdAt: new Date("2024-03-10"),
    photos: [
      {
        id: "p6",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Mountain View",
        location: "Swiss Alps, Switzerland",
        uploadDate: new Date("2024-03-10")
      },
      {
        id: "p7",
        url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Waterfall",
        location: "Plitvice, Croatia",
        uploadDate: new Date("2024-03-10")
      },
      {
        id: "p8",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Lake Reflection",
        location: "Banff, Canada",
        uploadDate: new Date("2024-03-10")
      }
    ]
  }
];

export const generateId = () => Math.random().toString(36).substr(2, 9);

const fallbackPhoto: Photo = {
  id: "fallback",
  url: "https://images.unsplash.com/photo-1628889923625-e3b33f73d780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  name: "Fallback Photo",
  uploadDate: new Date()
};

export const getAllPhotos = (albums: Album[]): Photo[] => {
  const photos = albums.flatMap(album => album.photos);
  return photos.length > 0 ? photos : [fallbackPhoto];
};

export const getPhotoByIdFromAlbums = (albums: Album[], photoId: string): Photo => {
  for (const album of albums) {
    const photo = album.photos.find(p => p.id === photoId);
    if (photo) return photo;
  }
  return getAllPhotos(albums)[0];
};

export const getPhotoIndexInAlbums = (albums: Album[], photoId: string): number => {
  const allPhotos = getAllPhotos(albums);
  const index = allPhotos.findIndex(p => p.id === photoId);
  return index >= 0 ? index + 1 : 1;
};

export const getPrevPhotoInAlbums = (albums: Album[], photoId: string): Photo => {
  const allPhotos = getAllPhotos(albums);
  const index = allPhotos.findIndex(p => p.id === photoId);
  if (index <= 0) return allPhotos[allPhotos.length - 1];
  return allPhotos[index - 1];
};

export const getNextPhotoInAlbums = (albums: Album[], photoId: string): Photo => {
  const allPhotos = getAllPhotos(albums);
  const index = allPhotos.findIndex(p => p.id === photoId);
  if (index === -1 || index === allPhotos.length - 1) return allPhotos[0];
  return allPhotos[index + 1];
};

export const saveAlbumsToStorage = (albums: Album[]) => {
  try {
    const serialized = albums.map(album => ({
      ...album,
      createdAt: album.createdAt.toISOString(),
      photos: album.photos.map(photo => ({
        ...photo,
        uploadDate: photo.uploadDate.toISOString()
      }))
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save albums to storage:', error);
  }
};

export const loadAlbumsFromStorage = (): Album[] => {
  try {
    // Check version - if mismatched, clear storage and use initial data
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return initialAlbums;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialAlbums;
    
    const parsed = JSON.parse(stored);
    return parsed.map((album: any) => ({
      ...album,
      createdAt: new Date(album.createdAt),
      photos: album.photos.map((photo: any) => ({
        ...photo,
        uploadDate: new Date(photo.uploadDate),
        location: photo.location
      }))
    }));
  } catch (error) {
    console.error('Failed to load albums from storage:', error);
    return initialAlbums;
  }
};
