import { useContext } from 'react';

import { MapContext } from '@/map/MapContextProvider';

const useMapContext = () => {
  const mapInstance = useContext(MapContext);
  const map = mapInstance?.map;
  const setMap = mapInstance?.setMap;
  const isMapLoaded = mapInstance?.isMapLoaded;
  const setIsMapLoaded = mapInstance?.setIsMapLoaded;
  const geoLocateControl = mapInstance?.geolocateControl;
  const userLocation = mapInstance?.userLocation;
  const geojson = mapInstance?.geojson;
  const setGeojson = mapInstance?.setGeojson;
  const mapType = mapInstance?.mapType;
  const setMapType = mapInstance?.setMapType;
  const isShowMapSatelliteToggle = mapInstance?.isShowMapSatelliteToggle;
  const setIsShowMapSatelliteToggle = mapInstance?.setIsShowMapSatelliteToggle;
  const draw = mapInstance?.draw;
  const setDraw = mapInstance?.setDraw;
  const selectedTool = mapInstance?.selectedTool;
  const setSelectedTool = mapInstance?.setSelectedTool;
  const userAddedGeojson = mapInstance?.userAddedGeojson;
  const setUserAddedGeojson = mapInstance?.setUserAddedGeojson;
  const addDraw = mapInstance?.addDraw;
  const removeDraw = mapInstance?.removeDraw;
  const selectedFeature = mapInstance?.selectedFeature;
  const setSelectedFeature = mapInstance?.setSelectedFeature;

  return {
    map,
    setMap,
    isMapLoaded,
    setIsMapLoaded,
    geoLocateControl,
    userLocation,
    geojson,
    setGeojson,
    mapType,
    setMapType,
    isShowMapSatelliteToggle,
    setIsShowMapSatelliteToggle,
    draw,
    setDraw,
    selectedTool,
    setSelectedTool,
    userAddedGeojson,
    setUserAddedGeojson,
    addDraw,
    removeDraw,
    selectedFeature,
    setSelectedFeature,
  };
};

export default useMapContext;
