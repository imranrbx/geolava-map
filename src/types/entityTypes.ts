export type Place = {
  longitude: number;
  latitude: number;
};

export type UserRequest = {
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | null;
};

export type UserProfile = {
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | null;
  id: string | undefined;
  subscriptions: string | undefined;
  credits: number | undefined;
};

export type AdditionalContext = {
  userLon: number | undefined;
  userLat: number | undefined;
  userId: string | undefined;
  [key: string]: any;
};

export type QueryAIRequest = {
  query: string | undefined;
  additionalContext: AdditionalContext | undefined;
  stream?: boolean;
};

export type QueryAIResponse = {
  finalAnswer: string | undefined;
  followupSuggestions: string[] | undefined;
  metadata: any;
};

export interface UserLocation {
  longitude: number;
  latitude: number;
  heading: number;
}

export type MapViewType = 'street' | 'satellite';

export enum MapToolMode {
  DRAW_POINT = 'draw_point',
  POLYGON = 'draw_polygon',
  LINESTRING = 'linestring',
  SELECT = 'select',
}

export interface MapObjSetting {
  user_width?: number;
  user_color?: string;
  show_label?: boolean;
  name?: string;
}

export enum MapObjType {
  POLYGON = 'Polygon',
  LINESTRING = 'LineString',
  POINT = 'Point',
}
