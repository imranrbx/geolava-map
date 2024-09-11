import * as turf from '@turf/turf';

export const getBbox = (geojson: turf.AllGeoJSON) => {
  const bbox = turf.bbox(geojson);
  return bbox as [number, number, number, number] | null;
};

/**
 * Generates a random ID of the specified length.
 *
 * @param length - The length of the ID to generate.
 * @returns The randomly generated ID.
 */
export const generateRandomId = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Generates a session ID for web applications.
 * The session ID is in the format "web-{randomId}-{randomId}-{timestamp}".
 * @returns The generated session ID.
 */
export const generateSessionId = () =>
  `web-${generateRandomId(2)}-${generateRandomId(3)}-${Date.now().toString(36)}`;
// `web-6w-r10-m0ni30fh`;
