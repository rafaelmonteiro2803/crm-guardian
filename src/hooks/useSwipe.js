import { useState, useRef } from 'react';

export function useSwipe(onSwipeLeft, onSwipeRight) {
  const [translateX, setTranslateX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const SWIPE_THRESHOLD = 40; // Minimum distance to trigger swipe
  const SWIPE_WIDTH = 100; // Max translate distance

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Check if movement is mostly horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
      // Only allow left swipe (negative diffX)
      if (diffX < 0) {
        setTranslateX(Math.max(diffX, -SWIPE_WIDTH));
      } else if (isOpen) {
        // Allow right swipe only if already open
        setTranslateX(Math.min(diffX, 0));
      }
    }
  };

  const handleTouchEnd = (e) => {
    const currentX = translateX;
    const threshold = SWIPE_WIDTH * 0.4; // 40% of width

    if (currentX < -threshold) {
      // Swipe left detected - open actions
      setTranslateX(-SWIPE_WIDTH);
      setIsOpen(true);
      onSwipeLeft?.();
    } else if (currentX > -threshold) {
      // Close actions
      setTranslateX(0);
      setIsOpen(false);
      onSwipeRight?.();
    }

    touchStartX.current = 0;
  };

  const close = () => {
    setTranslateX(0);
    setIsOpen(false);
  };

  return {
    translateX,
    isOpen,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    close,
  };
}
