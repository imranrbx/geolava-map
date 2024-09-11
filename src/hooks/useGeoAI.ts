import axios from 'axios';
import { getAuthorizationToken } from '@/utils/firebase';
import useSWR, { mutate } from 'swr';
import { AppConfig, GeoAIEndpoint } from '@/AppConfig';
import { QueryAIRequest, QueryAIResponse } from '@/types/entityTypes';
import { Subject } from 'rxjs';

const parseLastMessage = (eventString: string) => {
  // Split the string into individual messages by looking for double newlines
  const messageBlocks = eventString
    .trim()
    .split('\n\n')
    .map((block: string) => {
      const lines = block.split('\n').filter((line: string) => line.trim());
      const event = lines[0].split('event:')[1].trim();
      const data = JSON.parse(lines[1].split('data:')[1].trim());
      const id = parseInt(lines[2].split('id:')[1].trim(), 10);
      return { event, data, id };
    });

  // Parse the last message block
  const lastBlock = messageBlocks[messageBlocks.length - 1];
  const { event, data, id } = lastBlock;

  if (data.preFinal) {
    // Combine all the preFinal data into a single string
    const preFinalData = messageBlocks
      .filter((block: any) => block.data.preFinal)
      .map((block: any) => block.data.preFinal)
      .join('');

    return { event, data: { preFinal: preFinalData }, id };
  }

  // Return as an object
  return { event, data, id };
};

const geoClient = axios.create({
  baseURL: AppConfig.geoUrl,
});

geoClient.defaults.headers.common['Content-Type'] = 'application/json';

/** interceptor that add token to each request */
geoClient.interceptors.request.use(
  async config => {
    config.headers.authorization = await getAuthorizationToken();

    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor for API calls
geoClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      (error.response.status === 403 || error.response.status === 401) &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      axios.defaults.headers.authorization = await getAuthorizationToken();
      return geoClient(originalRequest);
    }
    return Promise.reject(error);
  },
);

const queryAI = async (query: QueryAIRequest) =>
  geoClient.post<QueryAIResponse>(GeoAIEndpoint.AI_ENDPOINT, JSON.stringify(query));

const streamAI = async (query: QueryAIRequest, onDownloadProgress: (progressEvent: any) => void) =>
  geoClient.post<QueryAIResponse>(GeoAIEndpoint.AI_ENDPOINT, JSON.stringify(query), {
    onDownloadProgress,
  });

const getPolygon = async (loc: [number, number]) =>
  geoClient.post<GeoJSON.FeatureCollection>(
    GeoAIEndpoint.BUILDING_POLYGONS,
    JSON.stringify({ loc }),
  );

export const queryAIMutation = async (query: QueryAIRequest) => {
  const data = await mutate(GeoAIEndpoint.AI_ENDPOINT, queryAI(query));
  return {
    answer: data?.data,
  };
};

export const streamAIMutation = async (query: QueryAIRequest, subject: Subject<any>) => {
  const onDownloadProgressHandler = (progressEvent: any) => {
    const xhr = progressEvent.event.target;
    const { responseText } = xhr;
    const payload = parseLastMessage(responseText);
    subject.next(payload);

    if (xhr.readyState === 4) {
      subject.complete();
    }
  };

  mutate(GeoAIEndpoint.AI_ENDPOINT, streamAI(query, onDownloadProgressHandler));
};

export const queryPolygonMutation = async (loc: [number, number]) => {
  const data = await mutate(GeoAIEndpoint.BUILDING_POLYGONS, getPolygon(loc));
  return {
    featureCollection: data?.data,
  };
};

const fetcherImage = async (url: string) => geoClient.get<Blob>(url, { responseType: 'blob' });

export const useRoofPicture = (wkt: string) => {
  const { data, error, isLoading } = useSWR(
    `${GeoAIEndpoint.ROOF_PICTURE}?wkt=${wkt}`,
    fetcherImage,
  );
  return {
    image: data?.data,
    isLoading,
    isError: error,
  };
};
