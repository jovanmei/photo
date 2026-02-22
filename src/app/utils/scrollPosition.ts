const SCROLL_STORAGE_KEY = 'photoGallery_scrollPositions';

interface ScrollPositions {
  [key: string]: number;
}

export const saveScrollPosition = (key: string) => {
  try {
    const positions = getScrollPositions();
    positions[key] = window.scrollY;
    localStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
  } catch (error) {
    console.error('Failed to save scroll position:', error);
  }
};

export const getScrollPositions = (): ScrollPositions => {
  try {
    const stored = localStorage.getItem(SCROLL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to get scroll positions:', error);
    return {};
  }
};

export const restoreScrollPosition = (key: string) => {
  try {
    const positions = getScrollPositions();
    const position = positions[key];
    if (position !== undefined) {
      window.scrollTo({
        top: position,
        behavior: 'instant'
      });
    }
  } catch (error) {
    console.error('Failed to restore scroll position:', error);
  }
};

export const clearScrollPosition = (key: string) => {
  try {
    const positions = getScrollPositions();
    delete positions[key];
    localStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
  } catch (error) {
    console.error('Failed to clear scroll position:', error);
  }
};
