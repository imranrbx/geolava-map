import { ViewState } from 'react-map-gl';
import { create } from 'zustand';

interface MapStoreValues {
  viewportWidth?: number;
  setViewportWidth: (payload: number | undefined) => void;
  viewportHeight?: number;
  setViewportHeight: (payload: number | undefined) => void;
  viewState: ViewState | undefined;
  setViewState: (payload: ViewState) => void;
  throttledViewState: ViewState | undefined;
  setThrottledViewState: (payload: ViewState) => void;
  isAnimating: boolean;
  setIsAnimating: (payload: boolean) => void;
  is3DMode: boolean;
  setIs3DMode: (payload: boolean) => void;
  isSatelliteView: boolean;
  setIsSatelliteView: (payload: boolean) => void;
  isMapGlLoaded?: boolean;
  setIsMapGlLoaded: (payload: boolean) => void;
}

/**
 * A custom hook that creates a Zustand store for managing map-related state.
 * @returns An object containing the store's state values and setter functions.
 */
const useMapStore = create<MapStoreValues>()(set => ({
  viewportWidth: undefined,
  setViewportWidth: payload => set(() => ({ viewportWidth: payload })),

  viewportHeight: undefined,
  setViewportHeight: payload => set(() => ({ viewportHeight: payload })),

  viewState: undefined,
  setViewState: payload => set(() => ({ viewState: payload })),

  throttledViewState: undefined,
  setThrottledViewState: payload => set(() => ({ throttledViewState: payload })),

  isAnimating: false,
  setIsAnimating: payload => set(() => ({ isAnimating: payload })),

  is3DMode: false,
  setIs3DMode: payload => set(() => ({ is3DMode: payload })),

  isSatelliteView: false,
  setIsSatelliteView: payload => set(() => ({ isSatelliteView: payload })),

  isMapGlLoaded: false,
  setIsMapGlLoaded: payload => set(() => ({ isMapGlLoaded: payload })),
}));

export default useMapStore;
