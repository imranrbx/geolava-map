import { AppConfig } from '@/AppConfig';
import { MapViewType, UserLocation } from '@/types/entityTypes';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import mapboxgl from 'mapbox-gl';
import { createContext, useEffect, useState } from 'react';
import { MapRef } from 'react-map-gl';
import {
  useDeleteUserGeojsonMutation,
  useUpdateUserGeojsonMutation,
  useUserGeojsonMutation,
} from '@/hooks/users';
import useSessionInfoStore from '@/zustand/useSessionInfoStore';
import { appMapLineLayer, appMapPointsLayer, appMapPolygonLayer } from './Layers/layers';

interface MapContextValues {
  map: MapRef | undefined;
  setMap: (e: MapRef | undefined) => void;
  isMapLoaded: boolean;
  setIsMapLoaded: (e: boolean) => void;
  geolocateControl: mapboxgl.GeolocateControl | null;
  userLocation: UserLocation | null;
  geojson: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.Polygon> | null;
  setGeojson: (e: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.Polygon> | null) => void;
  mapType: MapViewType;
  setMapType: (e: MapViewType) => void;
  isShowMapSatelliteToggle: boolean;
  setIsShowMapSatelliteToggle: (e: boolean) => void;
  draw: MapboxDraw | null;
  setDraw: (e: MapboxDraw | null) => void;
  selectedTool: string | null;
  setSelectedTool: (e: string | null) => void;
  userAddedGeojson: GeoJSON.FeatureCollection<any> | null;
  setUserAddedGeojson: (
    e: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.Polygon> | null,
  ) => void;
  addDraw: (hardRefresh?: boolean) => void;
  removeDraw: () => void;
  selectedFeature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | null;
  setSelectedFeature: (
    e: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | null,
  ) => void;
}

export const MapContext = createContext<MapContextValues>({} as MapContextValues);

interface MapContextProviderProps {
  children: React.ReactNode;
}

const tempLocation = {
  latitude: AppConfig.map.defaultLatitude,
  longitude: AppConfig.map.defaultLongitude,
  heading: 0,
};

function MapContextProvider({ children }: MapContextProviderProps) {
  const [map, setMap] = useState<MapRef | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(tempLocation);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [geolocateControl, setGeoLocateControl] = useState<mapboxgl.GeolocateControl | null>(null);
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection<
    GeoJSON.Point | GeoJSON.Polygon
  > | null>(null);
  const [userAddedGeojson, setUserAddedGeojson] = useState<GeoJSON.FeatureCollection<any> | null>(
    null,
  );
  const [mapType, setMapType] = useState<MapViewType>('street');
  const [isShowMapSatelliteToggle, setIsShowMapSatelliteToggle] = useState(false);
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature<
    GeoJSON.Geometry,
    GeoJSON.GeoJsonProperties
  > | null>(null);
  const userGeojsonMutation = useUserGeojsonMutation();
  const updateUserGeojsonMutation = useUpdateUserGeojsonMutation();
  const deleteUserGeojsonMutation = useDeleteUserGeojsonMutation();

  const removeDraw = () => {
    if (!map || !draw) return;
    setSelectedTool(null);
  };

  useEffect(() => {
    if (isMapLoaded && !geolocateControl) {
      const control = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });
      map?.addControl(control);
      setGeoLocateControl(control);
    }
  }, [isMapLoaded, geolocateControl, map]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => setUserLocation(position.coords as UserLocation),
      error => {
        console.log(error); // eslint-disable-line no-console
      },
    );
  }, []);

  useEffect(() => {
    if (!selectedTool) {
      if (draw) map?.removeControl(draw);
      setDraw(null);
    }
  }, [selectedTool]);

  useEffect(() => {
    if (map && draw) {
      map.on('draw.create', async event => {
        const feature = event.features[0];
        if (feature) {
          await userGeojsonMutation.trigger({
            geojson: feature,
            chat_id: useSessionInfoStore.getState().sessionId,
          });
        }
        removeDraw();
      });

      map.on('draw.delete', async event => {
        const feature = event.features[0];
        if (feature.id) {
          await deleteUserGeojsonMutation.trigger(feature.id as string);
        }
      });
      map.on('draw.update', async event => {
        const feature = event.features[0];
        if (feature.id) {
          await updateUserGeojsonMutation.trigger({
            geojson: feature,
          });
        }
      });
      map.on('draw.selectionchange', e => {
        if (e.features.length > 0 && selectedTool === 'simple_select') {
          setSelectedFeature(e.features[0]);
        }
      });
    }
  }, [map, draw]);

  const addDraw = (hardRefresh = false) => {
    if (!map) return;
    const drawControl = new MapboxDraw({
      displayControlsDefault: false,
      userProperties: true,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
      styles: [...appMapPointsLayer(), ...appMapPolygonLayer(), ...appMapLineLayer()],
    });
    if (hardRefresh && userAddedGeojson) {
      if (draw) {
        map.removeControl(draw);
      }
      map.addControl(drawControl);
      drawControl.set(userAddedGeojson);
    } else {
      map.addControl(drawControl);
    }
    setDraw(drawControl);
  };

  const state = {
    isMapLoaded,
    setIsMapLoaded,
    map,
    setMap,
    geolocateControl,
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

  return <MapContext.Provider value={state}>{children}</MapContext.Provider>;
}

export default MapContextProvider;
