export const AppConfig = {
  defaultLanguage: 'en',
  defaultMarkerCount: 500,
  defaultClusterRadius: 80,
  ui: {
    barHeight: 10,
    barIconSize: 32,
    bigIconSize: 48,
    markerIconSize: 32,
    twBorderRadius: 'rounded',
    mapIconSizeSmall: 28,
    mapIconSizeBig: 56,
  },
  map: {
    deadzone: 50,
    tileKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    defaultZoom: 12,
    defaultLatitude: 37.74183465425861,
    defaultLongitude: -122.4093443229233,
    satelliteMapStlye: process.env.NEXT_PUBLIC_MAPBOX_SATELLITE_STYLE || '',
    defaultMapStyle: process.env.NEXT_PUBLIC_MAPBOX_STREET_STYLE || '',
  },
  mode: process.env.NODE_ENV,
  animationDuration: 500,
  userUrl: process.env.NEXT_PUBLIC_USER_API_URL,
  geoUrl: process.env.NEXT_PUBLIC_GEO_API_URL,
  firebaseConfig: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  stripe: {
    addCreditPriceId: process.env.NEXT_PUBLIC_STRIPE_ADD_CREDIT_PRICE_ID,
    proPlanPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE_ID,
    unlimitedPlanPriceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PLAN_PRICE_ID,
  },
};

export enum UserEndpoint {
  USER_URL = '/v1/users',
  USER_AVATAR = '/v1/users/avatar',
  USER_GEOJSON = '/v1/geojson',
  USER_STRIPE_CHECKOUT = '/v1/stripe/checkout',
}

export enum GeoAIEndpoint {
  AI_ENDPOINT = '/ai/ask',
  ROOF_PICTURE = '/property/roof/picture',
  BUILDING_POLYGONS = '/features/building-polygons',
}
