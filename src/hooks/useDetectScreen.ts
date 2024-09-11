import { useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { shallow } from 'zustand/shallow';

import useMapStore from '@/zustand/useMapStore';

const useDetectScreen = () => {
  const { innerHeight } = window;
  const [setViewportWidth, setViewportHeight, viewportWidth, viewportHeight] = useMapStore(
    state => [
      state.setViewportWidth,
      state.setViewportHeight,
      state.viewportWidth,
      state.viewportHeight,
    ],
    shallow,
  );

  const {
    width,
    height,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
  });

  useEffect(() => {
    if (width && viewportRef.current) {
      setViewportWidth(width);
    }
  }, [width, viewportRef, setViewportWidth]);

  useEffect(() => {
    if ((height || innerHeight) && viewportRef.current) {
      setViewportHeight(height || innerHeight);
    }
  }, [height, setViewportHeight, viewportRef]);

  return { viewportRef, viewportWidth, viewportHeight } as const;
};

export default useDetectScreen;
