'use client';

import { throttle } from 'lodash';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import type { ErrorEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import useDetectScreen from '@/hooks/useDetectScreen';
import { AppConfig } from '@/AppConfig';
import MapContextProvider from '@/map/MapContextProvider';
import useMapStore from '@/zustand/useMapStore';
import useMapContext from '@/map/useMapContext';
import Sidebar from '@/components/Sidebar';
import Chatbar from '@/components/ChatBar';
import { AuthContext } from '@/context/authContext';
import {
  useUserProfile,
  useUpdateUserGeojsonMutation,
  useDeleteUserGeojsonMutation,
} from '@/hooks/users';
import Image from 'next/image';
import { getBbox } from '@/utils/common';
import ProfileInfoModal from '@/components/common/profileInfoModal';
import useSettingsStore from '@/zustand/useSettingsStore';
import { MapObjSetting, MapObjType } from '@/types/entityTypes';

/** error handle */
const onMapError = (evt: ErrorEvent) => {
  const { error } = evt;
  // eslint-disable-next-line no-console
  console.error('Map error:', error);
  // throw new Error(`Map error: ${error.message}`);
};

// // bundle splitting
const Popups = dynamic(() => import('@/map/Popups'));
const Layers = dynamic(() => import('@/map/Layers'));
const Labels = dynamic(() => import('@/map/Labels'));
const HeaderToolBar = dynamic(() => import('@/components/common/HeaderToolBar'));
const MapObjSettings = dynamic(() => import('@/components/common/MapObjSettings'));

function MapInner() {
  const setViewState = useMapStore(state => state.setViewState);
  const setThrottledViewState = useMapStore(state => state.setThrottledViewState);
  const setIs3DMode = useMapStore(state => state.setIs3DMode);
  const is3DMode = useMapStore(state => state.is3DMode);
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded);
  const { user } = useContext(AuthContext);
  const { profile, isLoading } = useUserProfile();
  const setIsMapGlLoaded = useMapStore(state => state.setIsMapGlLoaded);
  const {
    setMap,
    map,
    setIsMapLoaded,
    geoLocateControl,
    userLocation,
    geojson,
    selectedFeature,
    setSelectedFeature,
    selectedTool,
    userAddedGeojson,
  } = useMapContext();
  const { viewportHeight, viewportRef } = useDetectScreen();
  const { isSatelliteView, setIsSatelliteView } = useMapStore(state => ({
    isSatelliteView: state.isSatelliteView,
    setIsSatelliteView: state.setIsSatelliteView,
  }));
  const isProfileModalVisible = useSettingsStore(state => state.isProfileModalVisible);
  const isTopProfileModalVisible = useSettingsStore(state => state.isTopProfileModalVisible);
  const updateUserGeojsonMutation = useUpdateUserGeojsonMutation();
  const deleteUserGeojsonMutation = useDeleteUserGeojsonMutation();

  const throttledSetViewState = useMemo(
    () => throttle((state: ViewState) => setThrottledViewState(state), 50),
    [setThrottledViewState],
  );

  const onLoad = useCallback(() => {
    if (isMapGlLoaded || !map) return;
    setIsMapGlLoaded(true);
    setIsMapLoaded(true);
    map.loadImage('/chat/pin-icon.png', (error, image) => {
      if (error) throw error;
      // add image to the active style and make it SDF-enabled
      if (image) {
        map.addImage('pin-sdf-icon', image, { sdf: true });
      }
    });
  }, [isMapGlLoaded, setIsMapGlLoaded, setIsMapLoaded, map]);

  const onMapMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      throttledSetViewState(evt.viewState);
      setViewState(evt.viewState);
    },
    [setViewState, throttledSetViewState],
  );

  const zoomIn = () => {
    if (!map) return;
    const center = map?.getCenter();
    map?.flyTo({
      center,
      zoom: map.getZoom() + 1,
    });
  };

  const zoomOut = () => {
    if (!map) return;
    const center = map?.getCenter();
    map?.flyTo({
      center,
      zoom: map.getZoom() - 1,
    });
  };

  const changePitch = () => {
    if (!map) return;
    const center = map?.getCenter();
    map?.flyTo({
      center,
      pitch: 75,
    });
    setIs3DMode(true);
  };

  const changePitchTo3D = () => {
    if (!map) return;
    const center = map?.getCenter();
    map?.flyTo({
      center,
      pitch: 0,
    });
    setIs3DMode(false);
  };

  const followMe = () => {
    if (!map || !userLocation) return;
    geoLocateControl?.trigger();
    map?.flyTo({
      center: [userLocation?.longitude, userLocation?.latitude],
      zoom: map.getZoom(),
    });
  };

  const toogleView = () => {
    if (!map || !userLocation) return;
    if (isSatelliteView) {
      setIsSatelliteView(false);
      map?.getMap().setStyle(AppConfig.map.defaultMapStyle);
      return;
    }
    setIsSatelliteView(true);
    map?.getMap().setStyle(AppConfig.map.satelliteMapStlye);
  };

  useEffect(() => {
    if (!user) {
      redirect('/login');
    }
  });

  useEffect(() => {
    if (selectedTool !== 'simple_select' && selectedFeature) {
      setSelectedFeature(null);
    }
  }, [selectedTool]);

  useEffect(() => {
    if (geojson && geojson?.features?.length > 0) {
      if (
        geojson?.features.length === 1 &&
        geojson?.features?.some(f => f.geometry?.type?.toLowerCase() === 'point')
      ) {
        const pointFeature = geojson.features.find(
          f => f.geometry?.type?.toLowerCase() === 'point',
        );
        map?.flyTo({
          center: pointFeature?.geometry.coordinates as [number, number],
          zoom: 18,
        });
      } else {
        const bbox = getBbox(geojson);
        if (bbox) {
          map?.fitBounds(bbox, {
            padding: 100,
          });
        }
      }
    }
  }, [geojson, map]);

  const updateFeatureSettings = async (featureId: string, settings: MapObjSetting) => {
    const currentFeature = userAddedGeojson?.features.find(f => f.id === featureId);
    await updateUserGeojsonMutation.trigger({
      geojson: {
        ...currentFeature,
        properties: settings,
      },
    });
  };

  const deleteFeature = async (id: string) => {
    await deleteUserGeojsonMutation.trigger(id as string);
  };

  return (
    <div className="relative h-full flex flex-auto inset-0 overflow-hidden" ref={viewportRef}>
      <div className="flex w-2/4 bg-background">
        <Sidebar profile={profile} />
        {!isLoading && <Chatbar profile={profile} />}
      </div>
      <div className="flex w-2/4">
        <Map
          // {...throttledSetViewState}
          mapboxAccessToken={AppConfig.map.tileKey}
          initialViewState={{
            longitude: AppConfig.map.defaultLongitude,
            latitude: AppConfig.map.defaultLatitude,
            zoom: AppConfig.map.defaultZoom,
          }}
          ref={e => setMap && setMap(e || undefined)}
          onError={e => onMapError(e)}
          onLoad={onLoad}
          onMove={onMapMove}
          style={{ height: viewportHeight }}
          mapStyle={AppConfig.map.defaultMapStyle}
          dragRotate={false}
        >
          <HeaderToolBar profile={profile} />
          <Layers />
          <Popups />
          <Labels />
          <div className="mapZoomButtons">
            {is3DMode ? (
              <Image
                height={58}
                width={58}
                alt="3D"
                src="/chat/2D-button.svg"
                onClick={changePitchTo3D}
              />
            ) : (
              <Image
                height={58}
                width={58}
                alt="3D"
                src="/chat/3D-button.svg"
                onClick={changePitch}
              />
            )}
            <Image height={58} width={58} alt="plus" src="/chat/plus.svg" onClick={zoomIn} />
            <Image height={58} width={58} alt="minus" src="/chat/minus.svg" onClick={zoomOut} />
            <Image
              height={58}
              width={58}
              src="/chat/userlocation.svg"
              alt="User Location"
              title="Show my location"
              role="button"
              onClick={followMe}
            />
          </div>
          <div className="mapUserLocation">
            {isSatelliteView ? (
              <Image
                height={44}
                width={92}
                src="/chat/Map-Satelite-View.svg"
                alt="Map Default View"
                role="button"
                onClick={toogleView}
              />
            ) : (
              <Image
                height={44}
                width={92}
                src="/chat/map-default-view.svg"
                alt="Map Default View"
                role="button"
                onClick={toogleView}
              />
            )}
          </div>
          {selectedFeature && (
            <MapObjSettings
              featureId={selectedFeature.id?.toString() ?? ''}
              type={selectedFeature.geometry?.type as MapObjType}
              settings={selectedFeature.properties as MapObjSetting}
              updateSettings={updateFeatureSettings}
              deleteFeature={deleteFeature}
            />
          )}
        </Map>
      </div>
      <div className="absolute bottom-[140px] left-[118px] z-50">
        {isProfileModalVisible && <ProfileInfoModal profile={profile} />}
      </div>
      <div className="absolute top-[90px] right-[10px] z-50">
        {isTopProfileModalVisible && <ProfileInfoModal profile={profile} />}
      </div>
    </div>
  );
}

// context pass through
function MapContainer() {
  return (
    <MapContextProvider>
      <MapInner />
    </MapContextProvider>
  );
}

export default MapContainer;
