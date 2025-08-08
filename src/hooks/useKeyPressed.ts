import { useEffect, useState } from 'react';

export function useKeyPressed<T extends string>(keys: T[]) {
  const initialState = keys.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as Record<T, boolean>);

  const [pressed, setPressed] = useState(initialState);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (keys.includes(e.key as T)) {
        setPressed((prev) => ({ ...prev, [e.key]: true }));
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (keys.includes(e.key as T)) {
        setPressed((prev) => ({ ...prev, [e.key]: false }));
      }
    }
    function onBlur() {
      setPressed(initialState);
    }
    function onVisibilityChange() {
      if (document.visibilityState !== 'visible') {
        setPressed(initialState);
      }
    }

    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
      window.removeEventListener('keyup', onKeyUp, { capture: true } as any);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [keys]);

  return pressed;
}