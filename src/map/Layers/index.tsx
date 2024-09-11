import { useEffect, useMemo, useState } from 'react';
import { Layer, Source } from 'react-map-gl';

import {
  mapDataPointsActiveLayer,
  mapDataPolygonActiveLayer,
  mapDataPointsLayer,
  mapDataPolygonsFillLayer,
  mapDataPolygonsLayer,
  mapDataPolygonsLineLayer,
  mapDataLinesActiveLayer,
  mapDataPolygonStrokeActiveLayer,
} from '@/map/Layers/layers';
import useMapContext from '@/map/useMapContext';
import { queryPolygonMutation } from '@/hooks/useGeoAI';
import { useUserGeojson } from '@/hooks/users';

const Layers = () => {
  const {
    map,
    draw,
    geojson,
    userAddedGeojson,
    setUserAddedGeojson,
    selectedTool,
    addDraw,
    removeDraw,
  } = useMapContext();
  const [polygonsGeojson, setPolygonsGeojson] = useState<any>();
  const { features } = useUserGeojson();
  const getPolygons = async () => {
    if (!geojson) {
      return;
    }

    const polygons = await Promise.all(
      geojson.features.map(async feature => {
        if (feature?.geometry?.type === 'Point' && feature?.geometry?.coordinates) {
          const mapFeatures = await queryPolygonMutation([
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ]);
          return mapFeatures;
        }
        return undefined;
      }),
    );
    const filteredPolygons = polygons.filter(polygon => polygon !== undefined);
    const mapFeatures = filteredPolygons.map(polygon => polygon?.featureCollection?.features[0]);
    if (filteredPolygons) {
      setPolygonsGeojson({
        type: 'FeatureCollection',
        features: mapFeatures,
      });
    }
  };

  useEffect(() => {
    if (userAddedGeojson) {
      getPolygons();
    }
  }, [geojson]);

  useEffect(() => {
    if (features) {
      setUserAddedGeojson({
        type: 'FeatureCollection',
        features,
      });
    }
  }, [features, features?.length]);
  useEffect(() => {
    if (userAddedGeojson) {
      if (selectedTool === 'simple_select') {
        // removeDraw();
        draw?.set(userAddedGeojson);
        // addDraw(true);
      }
    }
  }, [userAddedGeojson]);
  const layers = useMemo(() => {
    if (!geojson && !userAddedGeojson) {
      return null;
    }
    return (
      <>
        {userAddedGeojson && selectedTool !== 'simple_select' && (
          <Source type="geojson" data={userAddedGeojson} clusterMaxZoom={20}>
            <Layer {...mapDataPointsActiveLayer()} />
            <Layer {...mapDataLinesActiveLayer()} />
            <Layer {...mapDataPolygonActiveLayer()} />
            <Layer {...mapDataPolygonStrokeActiveLayer()} />
          </Source>
        )}
        {geojson && (
          <Source type="geojson" data={geojson} clusterMaxZoom={18}>
            <Layer {...mapDataPolygonsLayer()} />
            <Layer {...mapDataPolygonsFillLayer()} />
            <Layer {...mapDataPolygonsLineLayer()} />
            <Layer {...mapDataPointsLayer()} />
          </Source>
        )}
        {polygonsGeojson && (
          <Source type="geojson" data={polygonsGeojson} clusterMaxZoom={20}>
            <Layer {...mapDataPolygonsLayer()} />
            <Layer {...mapDataPolygonsFillLayer()} />
            <Layer {...mapDataPolygonsLineLayer()} />
          </Source>
        )}
      </>
    );
  }, [geojson, userAddedGeojson, polygonsGeojson, selectedTool]);

  return layers;
};

export default Layers;
