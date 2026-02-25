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
const CURRENT_VERSION = '6'; // Increment when data structure changes

export const initialAlbums: Album[] = [
  {
    id: "zms9o7p8t",
    title: "Life.",
    displayTitle: "life.",
    description: "Random things...",
    createdAt: new Date("2026-02-23"),
    photos: [
      {
        id: "r30tmhbnz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947196/photo-gallery/zms9o7p8t/IMG_4667_hoqgbr.jpg",
        name: "IMG_4667",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "3y2ahf15s",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947198/photo-gallery/zms9o7p8t/IMG_4606_zy48yy.jpg",
        name: "IMG_4606",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "cikct0uw8",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947200/photo-gallery/zms9o7p8t/IMG_4563_nejspw.jpg",
        name: "IMG_4563",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "pbzt8e0az",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947201/photo-gallery/zms9o7p8t/IMG_4346_cejh53.jpg",
        name: "IMG_4346",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "unz308wil",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947203/photo-gallery/zms9o7p8t/IMG_4273_crxszg.jpg",
        name: "IMG_4273",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "t34xt6ob9",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947204/photo-gallery/zms9o7p8t/IMG_3777_jpkoat.jpg",
        name: "IMG_3777",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "lhi0iwnoz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947211/photo-gallery/zms9o7p8t/IMG_1941_na7lom.jpg",
        name: "IMG_1941",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "nzhln0bh5",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947212/photo-gallery/zms9o7p8t/BE8B52C2-EF22-43E8-B8DD-8E289AF62220_ju8qxg.jpg",
        name: "BE8B52C2-EF22-43E8-B8DD-8E289AF62220",
        uploadDate: new Date("2026-02-24")
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
        id: "wa0ly5x8r",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836623/photo-gallery/3/bysea_zzdmer.jpg",
        name: "bysea",
        description: "Between the sea breeze and their unhurried words, the years no longer feel like distance, but like a long, shared horizon stretching calmly before them.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "26ck0c6n9",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771808193/photo-gallery/3/P1160703_ahkwfi.jpg",
        name: "P1160703",
        description: "Find the line between roots.",
        location: "Wuhan, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "x5240opa2",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836604/photo-gallery/3/forest_vbatw4.jpg",
        name: "forest",
        description: "Between the rustling leaves and the patient earth, the sign stands still in the golden light, as if reminding us that guidance is gentle, but the journey is always ours.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "84q34i7q7",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947409/photo-gallery/3/IMG_4745_b4gzfq.jpg",
        name: "IMG_4745",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "jn4dh7n71",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947411/photo-gallery/3/IMG_4719_gwlqyy.jpg",
        name: "IMG_4719",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "r98gdwp37",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947413/photo-gallery/3/IMG_4708_q1ew1m.jpg",
        name: "IMG_4708",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "3ovm25qgm",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947414/photo-gallery/3/IMG_3632_hz5dz1.jpg",
        name: "IMG_3632",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "ws3mncd6b",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947415/photo-gallery/3/8236cf2e1d92c7ba062f9aa0db7b45e1_ckhkuj.jpg",
        name: "8236cf2e1d92c7ba062f9aa0db7b45e1",
        uploadDate: new Date("2026-02-24")
      }
    ]
  },
  {
    id: "5r9k8nfz5",
    title: "Palimpsest",
    displayTitle: "palimpsest",
    description: "Museum or something observed...",
    createdAt: new Date("2026-02-24"),
    photos: [
      {
        id: "lyzyygfiw",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836708/photo-gallery/zms9o7p8t/vangogh_dmjhud.jpg",
        name: "vangogh",
        description: "As they stand before the gaze of Vincent van Gogh, they are not merely looking at a portrait—they are meeting a soul that once burned too brightly for its own time. In the quiet exchange between their eyes and his painted stare, the centuries collapse, and we realize that to be seen by art is sometimes more unsettling than to see it.",
        location: "Amsterdam, Netherlands",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "zj04k33rr",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772035245/photo-gallery/5r9k8nfz5/vangogh1_r6vo0m.jpg",
        name: "vangogh1",
        uploadDate: new Date("2026-02-25")
      },
      {
        id: "0h59hrx5p",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772035078/photo-gallery/5r9k8nfz5/red_light_irlaq3.jpg",
        name: "red light",
        uploadDate: new Date("2026-02-25")
      },
      {
        id: "j6bf7kr8y",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836728/photo-gallery/zms9o7p8t/book_and_lake_sotziz.jpg",
        name: "book and lake",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "q1ab7ghhz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836720/photo-gallery/zms9o7p8t/sunflower_omeysp.jpg",
        name: "sunflower",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "47bj7qv5v",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836714/photo-gallery/zms9o7p8t/statue_o4kanj.jpg",
        name: "statue",
        description: "Here, light and horizon conspire to dissolve the boundary between nature and creation, so that walking through art feels like a meditation on the infinite possibilities of seeing and being seen.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      }
    ]
  },
  {
    id: "1",
    title: "Wildlife",
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
        description: "Old Man and the Fish.",
        location: "Wuhan, China",
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
      },
      {
        id: "6urd11725",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772035252/photo-gallery/1/dear1_upc5qq.jpg",
        name: "dear1",
        uploadDate: new Date("2026-02-25")
      }
    ]
  },
  {
    id: "vpilj9fcm",
    title: "Stone & Time",
    displayTitle: "stone&time",
    description: "Buildings...",
    createdAt: new Date("2026-02-23"),
    photos: [
      {
        id: "s5fsruwqg",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771851323/photo-gallery/vpilj9fcm/P1160032_nwccci.jpg",
        name: "P1160032",
        location: "Xiamen, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "wm149z8is",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771851345/photo-gallery/vpilj9fcm/P1160253_wu4043.jpg",
        name: "P1160253",
        location: "Xiamen, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "95k8tb4m6",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836698/photo-gallery/zms9o7p8t/church_bxliym.jpg",
        name: "church",
        description: "Beneath the towering pipes of Grundtvig's Church, silence feels architectural—as if sound itself were waiting to be born from stone and breath.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "iu6tx46bf",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947535/photo-gallery/vpilj9fcm/IMG_4357_kwqynx.jpg",
        name: "IMG_4357",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "3f3ylo3dc",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836587/photo-gallery/2/copen_sihtxc.jpg",
        name: "copen",
        description: "Along the bright facades of Nyhavn in Copenhagen, the houses stand like painted memories, while laughter and clinking glasses turn the harbor into a living canvas. Between the stillness of color and the warmth of shared meals, the moment feels like a quiet agreement between architecture and appetite—proof that beauty is best tasted slowly.",
        location: "Copenhagen, Denmark",
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
        id: "nlbh8wl0b",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947331/photo-gallery/2/IMG_4674_it6mkb.jpg",
        name: "IMG_4674",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "novve5b1w",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836593/photo-gallery/2/theweeknd_glr4pv.jpg",
        name: "theweeknd",
        description: "The Weeknd concert",
        location: "Amsterdam, Netherlands",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "xwsvqoyoz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836598/photo-gallery/2/maroon5_us9rd6.jpg",
        name: "maroon5",
        description: "Maroon 5 concert",
        location: "Amsterdam, Netherlands",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "vznnncb3z",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947299/photo-gallery/2/IMG_1703_qzuhnr.jpg",
        name: "IMG_1703",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "u4ctr58ko",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947332/photo-gallery/2/ECBD7E89-24C8-41C0-995C-8AD79AD36776_bpb6xh.jpg",
        name: "ECBD7E89-24C8-41C0-995C-8AD79AD36776",
        uploadDate: new Date("2026-02-24")
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
