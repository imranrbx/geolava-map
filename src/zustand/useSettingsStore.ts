import { create } from 'zustand';

import { AppConfig } from '@/AppConfig';

interface SettingsStoreValues {
  markersCount: number;
  setMarkersCount: (payload: number | undefined) => void;
  markerSize: number;
  setMarkerSize: (payload: number) => void;
  clusterRadius: number;
  setClusterRadius: (payload: number | undefined) => void;
  markerJSXRendering: boolean;
  setMarkerJSXRendering: (payload: boolean) => void;
  isProfileModalVisible: boolean;
  setIsProfileModalVisible: (payload: boolean) => void;
  isTopProfileModalVisible: boolean;
  setIsTopProfileModalVisible: (payload: boolean) => void;
  isPopModalVisible: boolean;
  setIsPopModalVisible: (payload: boolean) => void;
}

/**
 * A custom hook that returns a Zustand store for managing settings.
 * @returns {SettingsStoreValues} The Zustand store for managing settings.
 */

const initialSettings = {
  markerJSXRendering: false,
  isProfileModalVisible: false,
  isTopProfileModalVisible: false,
};

const useSettingsStore = create<SettingsStoreValues>()(set => ({
  ...initialSettings,

  markersCount: AppConfig.defaultMarkerCount,
  setMarkersCount: payload => set(() => ({ markersCount: payload })),

  markerSize: AppConfig.ui.markerIconSize,
  setMarkerSize: payload => set(() => ({ markerSize: payload })),

  clusterRadius: AppConfig.defaultClusterRadius,
  setClusterRadius: payload => set(() => ({ clusterRadius: payload })),

  markerJSXRendering: false,
  setMarkerJSXRendering: payload => set(() => ({ markerJSXRendering: payload })),

  isProfileModalVisible: false,
  setIsProfileModalVisible: payload => set(() => ({ isProfileModalVisible: payload })),

  isTopProfileModalVisible: false,
  setIsTopProfileModalVisible: payload => set(() => ({ isTopProfileModalVisible: payload })),

  isPopModalVisible: false,
  setIsPopModalVisible: payload => set(() => ({ isPopModalVisible: payload })),
}));

export default useSettingsStore;
