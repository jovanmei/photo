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
const CURRENT_VERSION = '3'; // Increment when data structure changes

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
        description: "The Panda in grayscale.",
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
      },
      {
        id: "p8ll48ix5",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771808159/photo-gallery/1/P1160683_xclraw.jpg",
        name: "P1160683",
        description: "Old man and the fish",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "6vh3g3lpu",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771846458/photo-gallery/1/P1160758_bgzpkg.jpg",
        name: "P1160758",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "jqo5c5qln",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771846466/photo-gallery/1/P1160775_spfrti.jpg",
        name: "P1160775",
        uploadDate: new Date("2026-02-23")
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
        id: "novve5b1w",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836593/photo-gallery/2/theweeknd_glr4pv.jpg",
        name: "theweeknd",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "p5",
        url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Street Photography",
        location: "London, UK",
        uploadDate: new Date("2024-02-20")
      },
      {
        id: "3f3ylo3dc",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836587/photo-gallery/2/copen_sihtxc.jpg",
        name: "copen",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "xwsvqoyoz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836598/photo-gallery/2/maroon5_us9rd6.jpg",
        name: "maroon5",
        uploadDate: new Date("2026-02-23")
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
      },
      {
        id: "26ck0c6n9",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771808193/photo-gallery/3/P1160703_ahkwfi.jpg",
        name: "P1160703",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "x5240opa2",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836604/photo-gallery/3/forest_vbatw4.jpg",
        name: "forest",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "wa0ly5x8r",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836623/photo-gallery/3/bysea_zzdmer.jpg",
        name: "bysea",
        uploadDate: new Date("2026-02-23")
      }
    ]
  },
  {
    id: "zms9o7p8t",
    title: "Life.",
    displayTitle: "life.",
    description: "Random things...",
    createdAt: new Date("2026-02-23"),
    photos: [
      {
        id: "lyzyygfiw",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836708/photo-gallery/zms9o7p8t/vangogh_dmjhud.jpg",
        name: "vangogh",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "95k8tb4m6",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836698/photo-gallery/zms9o7p8t/church_bxliym.jpg",
        name: "church",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "47bj7qv5v",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836714/photo-gallery/zms9o7p8t/statue_o4kanj.jpg",
        name: "statue",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "q1ab7ghhz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836720/photo-gallery/zms9o7p8t/sunflower_omeysp.jpg",
        name: "sunflower",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "j6bf7kr8y",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836728/photo-gallery/zms9o7p8t/book_and_lake_sotziz.jpg",
        name: "book and lake",
        uploadDate: new Date("2026-02-23")
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
