import { useMemo } from 'react';
import { Marker } from 'react-map-gl';
import { area, centroid, length, lineSlice } from '@turf/turf';
import * as turf from '@turf/turf';
import useMapContext from '@/map/useMapContext';
import { MapObjSetting, MapObjType } from '@/types/entityTypes';

interface PolygonWithArea {
  centroid: [number, number];
  area: string;
  properties: MapObjSetting | null;
}

interface LineWithDistance {
  midpoint: [number, number];
  distance: string;
  properties: MapObjSetting | null;
}

interface PointWithName {
  midpoint: [number, number];
  name: string;
  properties: MapObjSetting | null;
}

const Labels = () => {
  const { userAddedGeojson } = useMapContext();
  const calculateAreasAndCentroids = (
    features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[],
  ): PolygonWithArea[] =>
    features
      .filter(
        feature => feature.geometry.type === MapObjType.POLYGON && feature.properties?.show_label,
      )
      .map(polygon => {
        const polyCentroid = centroid(polygon);
        const polyAreaInSqft = area(polygon) * 10.7639;
        const polyAreaInAcres = area(polygon) * 0.000247105;
        const polyAreaInSqmiles = area(polygon) * 3.861e-7;
        let polyArea;
        if (polyAreaInAcres < 1) {
          polyArea = `${polyAreaInSqft.toFixed(2).toLocaleString()} sq ft`;
          // } else if (polyAreaInAcres < 1000) {
          //   polyArea = `${polyAreaInAcres.toFixed(2).toLocaleString()} ac`;
        } else {
          polyArea = `${polyAreaInSqmiles.toFixed(2).toLocaleString()} sq mi`;
        }
        return {
          centroid: polyCentroid.geometry.coordinates as [number, number],
          area: polyArea,
          properties: polygon.properties,
        };
      });

  const calculateDistancesAndMidpoints = (
    features: GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties>[],
  ): LineWithDistance[] =>
    features
      .filter(
        feature =>
          feature.geometry.type === MapObjType.LINESTRING && feature.properties?.show_label,
      )
      .map(line => {
        const totalDistanceInMiles = length(line, { units: 'miles' });
        const totalDistanceInFeet = length(line, { units: 'feet' });
        let totalDistance;
        if (totalDistanceInMiles < 0.1) {
          totalDistance = `${totalDistanceInFeet.toFixed(2).toLocaleString()} ft`;
        } else {
          totalDistance = `${totalDistanceInMiles.toFixed(2).toLocaleString()} mi`;
        }
        const centerPoint = turf.center(line).geometry.coordinates;
        return {
          midpoint: centerPoint as [number, number],
          distance: totalDistance,
          properties: line.properties,
        };
      });

  const generatePointLabels = (
    features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[],
  ): PointWithName[] =>
    features
      .filter(feature => feature.geometry.type === MapObjType.POINT)
      .map((point, index) => {
        const pointCoordinates = (point.geometry as GeoJSON.Point)?.coordinates as [number, number];
        return {
          midpoint: pointCoordinates,
          name: point.properties?.name || `Pin ${index + 1}`,
          properties: point.properties, // Add a default properties value
        };
      });

  const polygonsWithAreas = calculateAreasAndCentroids(userAddedGeojson?.features || []);
  const linesWithDistance = calculateDistancesAndMidpoints(userAddedGeojson?.features || []);
  const pointLabels = generatePointLabels(userAddedGeojson?.features || []);
  const labelBaseStyles =
    'text-xs text-white font-semibold py-1 px-4 border-[1px] border-solid rounded-full';
  const labels = useMemo(
    () => (
      <>
        {polygonsWithAreas.map((polygon, index) => (
          <Marker key={index} latitude={polygon.centroid[1]} longitude={polygon.centroid[0]}>
            <div
              className={labelBaseStyles}
              style={{
                backgroundColor: `${polygon.properties?.user_color || '#DC952A'}A0`,
                borderColor: polygon.properties?.user_color || '#DC952A',
              }}
            >
              {polygon.area}
            </div>
          </Marker>
        ))}
        {linesWithDistance.map((line, index) => (
          <Marker key={index} latitude={line.midpoint[1]} longitude={line.midpoint[0]}>
            <div
              className={labelBaseStyles}
              style={{
                backgroundColor: `${line.properties?.user_color || '#39D652'}A0`,
                borderColor: line.properties?.user_color || '#39D652',
              }}
            >
              {line.distance}
            </div>
          </Marker>
        ))}
        {pointLabels.map((point, index) => (
          <Marker
            key={index}
            latitude={point.midpoint[1]}
            longitude={point.midpoint[0]}
            offset={[0, -27]}
          >
            <div
              className={labelBaseStyles}
              style={{
                backgroundColor: `${point.properties?.user_color || '#DC952A'}A0`,
                borderColor: point.properties?.user_color || '#DC952A',
              }}
            >
              {point.name}
            </div>
          </Marker>
        ))}
      </>
    ),
    [userAddedGeojson, polygonsWithAreas],
  );

  return labels;
};

export default Labels;
