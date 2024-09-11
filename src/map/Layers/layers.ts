import type { LayerProps } from 'react-map-gl';

export const mapDataPolygonsLayer = (): LayerProps => ({
  id: 'mapDataPolygons',
  type: 'symbol',
  source: 'mapData',
  layout: {
    'symbol-sort-key': 1,
    'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.15, 16, 0.75],
    'icon-allow-overlap': false,
  },
});

export const mapDataPolygonsFillLayer = (): LayerProps => ({
  id: 'mapDataPolygons-fill',
  type: 'fill',
  source: 'mapData',
  paint: {
    'fill-color': '#30CFE4',
    'fill-opacity': 0.3,
  },
});

export const mapDataPolygonsLineLayer = (): LayerProps => ({
  id: 'mapDataPolygons-line',
  type: 'line',
  source: 'mapData',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#30CFE4',
    'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0, 15, 0, 15.99, 0, 16, 2],
  },
});

export const mapDataPointsLayer = (): LayerProps => ({
  id: 'mapDataPoints',
  type: 'symbol',
  source: 'mapData',
  layout: {
    'symbol-sort-key': 1,
    'icon-image': 'gl-default-pin',
    'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.15, 16, 0.75],
    'icon-allow-overlap': false,
  },
});

export const mapDataPointsActiveLayer = (): LayerProps => ({
  id: 'mapDataPoints',
  type: 'symbol',
  source: 'mapData',
  filter: ['all', ['==', '$type', 'Point']],
  layout: {
    'icon-image': 'pin-sdf-icon',
    'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 1, 16, 1],
    'icon-allow-overlap': false,
  },
  paint: {
    'icon-color': ['coalesce', ['get', 'user_color'], '#DC952A'], // Dynamically set icon color
  },
});

export const mapDataLinesActiveLayer = (): LayerProps => ({
  id: 'mapDataLines',
  type: 'line',
  source: 'mapData',
  filter: ['all', ['==', '$type', 'LineString']],
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': ['coalesce', ['get', 'user_color'], '#39D652'],
    'line-width': ['coalesce', ['get', 'user_width'], 2],
  },
});

export const mapDataPolygonActiveLayer = (): LayerProps => ({
  id: 'mapDataPolygons-fill',
  type: 'fill',
  source: 'mapData',
  filter: ['all', ['==', '$type', 'Polygon']],
  paint: {
    'fill-color': ['coalesce', ['get', 'user_color'], '#DC952A'],
    'fill-opacity': 0.3,
  },
});

export const mapDataPolygonStrokeActiveLayer = (): LayerProps => ({
  id: 'mapDataPolygons-stroke',
  type: 'line',
  source: 'mapData',
  filter: ['all', ['==', '$type', 'Polygon']],
  paint: {
    'line-color': ['coalesce', ['get', 'user_color'], '#DC952A'],
    'line-width': ['coalesce', ['get', 'user_width'], 2],
  },
});

export const appMapPointsLayer = (): LayerProps[] => [
  {
    id: 'gl-draw-point-inactive',
    type: 'symbol',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'icon-image': 'pin-sdf-icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 1, 16, 1],
      'icon-allow-overlap': false,
    },
    paint: {
      'icon-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'], // Dynamically set icon color
    },
  },
  {
    id: 'gl-draw-point-stroke-active',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
    layout: {
      'icon-image': 'pin-sdf-icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 1, 16, 1.5],
      'icon-allow-overlap': false,
    },
    paint: {
      'icon-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'], // Dynamically set icon color
    },
  },
  {
    id: 'gl-draw-point-active',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
    layout: {
      'icon-image': 'pin-sdf-icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 1, 16, 1],
      'icon-allow-overlap': false,
    },
    paint: {
      'icon-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'], // Dynamically set icon color
    },
  },
];

export const appMapPolygonLayer = (): LayerProps[] => [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'fill-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'],
      'fill-outline-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'],
      'fill-opacity': 0.4,
    },
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'],
      'fill-outline-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'],
      'fill-opacity': 0.1,
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#DC952A',
    },
  },
  {
    id: 'gl-draw-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'],
      'line-width': ['coalesce', ['get', 'user_user_width'], 2],
    },
  },
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'user_user_color'], '#DC952A'],
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
];

export const appMapLineLayer = (): LayerProps[] => [
  {
    id: 'gl-draw-line-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'user_user_color'], '#39D652'],
      'line-width': ['coalesce', ['get', 'user_user_width'], 2],
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#DC952A',
    },
  },
  {
    id: 'gl-draw-line-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'user_user_color'], '#39D652'],
      'line-width': ['coalesce', ['get', 'user_user_width'], 2],
    },
  },
];
