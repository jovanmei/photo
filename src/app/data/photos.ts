export const PHOTOS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1628889923625-e3b33f73d780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMHBhbmRhJTIwYmFtYm9vfGVufDF8fHx8MTc3MTY4NDE2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Panda Bamboo",
    year: 2025,
    number: "58"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509005084666-3cbc75184cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTY4NDE2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Dog Portrait",
    year: 2025,
    number: "59"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1574068774810-a5ccb01f9620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwZm9yZXN0JTIwbWFnaWNhbCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzcxNjg0MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Magical Horse",
    year: 2025,
    number: "60"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1687369113795-3ad7857df2dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGRlZXIlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzE2ODQxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Deer Dark",
    year: 2025,
    number: "61"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1621559578513-1d175effb731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGZveCUyMHNub3d8ZW58MXx8fHwxNzcxNjg0MTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Fox Snow",
    year: 2025,
    number: "63"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1567172180864-3a117bc0d02b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGVhZ2xlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxNjg0MTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Eagle Portrait",
    year: 2025,
    number: "64"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1750795095261-75f4627b343c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGxlb3BhcmQlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3MTY4NDE2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Leopard Closeup",
    year: 2025,
    number: "65"
  }
];

export const getPhotoById = (id: number) => PHOTOS.find(p => p.id === id);
export const getNextPhoto = (currentId: number) => {
  const currentIndex = PHOTOS.findIndex(p => p.id === currentId);
  if (currentIndex === -1) return PHOTOS[0];
  const nextIndex = (currentIndex + 1) % PHOTOS.length;
  return PHOTOS[nextIndex];
};
export const getPrevPhoto = (currentId: number) => {
  const currentIndex = PHOTOS.findIndex(p => p.id === currentId);
  if (currentIndex === -1) return PHOTOS[PHOTOS.length - 1];
  const prevIndex = (currentIndex - 1 + PHOTOS.length) % PHOTOS.length;
  return PHOTOS[prevIndex];
};
export const getPhotoIndex = (id: number) => PHOTOS.findIndex(p => p.id === id) + 1;
