import { useEffect, useRef, type RefObject } from 'react';

/**
 * Custom hook replacing MUI ClickAwayListener.
 * Calls the handler when a click occurs outside the referenced element.
 */
const useClickAway = <T extends HTMLElement>(
  handler: () => void,
): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
};

export default useClickAway;
