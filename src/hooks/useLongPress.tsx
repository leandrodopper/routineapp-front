import React, { useCallback, useRef } from 'react'

export const useLongPress = (
    onPress: () => void,
    onLongPress: () => void,
    { delay = 500 }: { delay?: number } = {}
  ) => {
    const timeout = useRef<number | null>(null);
  
    const startTimeout = useCallback(() => {
      timeout.current = setTimeout(() => {
        onLongPress();
      }, delay);
    }, [onLongPress, delay]);
  
    const cancelTimeout = useCallback(() => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }, []);
  
    return {
      onPress: () => {
        cancelTimeout();
        onPress();
      },
      onLongPress: startTimeout,
      onCancel: cancelTimeout,
    };
  };
