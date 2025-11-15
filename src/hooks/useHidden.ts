import { useCallback, useState } from 'react';

export const useHidden = (initialValue = false) => {
  const [isHidden, setIsHidden] = useState(initialValue);

  const hide = useCallback(() => {
    setIsHidden(true);
  }, []);

  const reveal = useCallback(() => {
    setIsHidden(false);
  }, []);

  return { isHidden, hide, reveal };
};
