import axios from 'axios';
import { getAuthorizationToken } from '@/utils/firebase';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { AppConfig, UserEndpoint } from '@/AppConfig';
import { UserRequest } from '@/types/entityTypes';
import useSessionInfoStore from '@/zustand/useSessionInfoStore';

const userClient = axios.create({
  baseURL: AppConfig.userUrl,
});

userClient.defaults.headers.common['Content-Type'] = 'application/json';

/** interceptor that add token to each request */
userClient.interceptors.request.use(
  async config => {
    config.headers.authorization = await getAuthorizationToken();

    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor for API calls
userClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      (error.response.status === 403 || error.response.status === 401) &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      axios.defaults.headers.authorization = await getAuthorizationToken();
      return userClient(originalRequest);
    }
    return Promise.reject(error);
  },
);
const UserQueryKeys = {
  fetchUser: 'fetchUser',
  postUser: 'postUser',
  pustUser: 'putUser',
};

const fetcher = async (url: string) => userClient.get(url);

const registerUser = async (url: string, { arg }: { arg: UserRequest }) =>
  userClient.post(url, JSON.stringify(arg));

const addUserGeojson = async (url: string, { arg }: { arg: any }) =>
  userClient.post(url, JSON.stringify(arg));

const deleteUserGeojson = async (url: string, { arg }: { arg: string }) =>
  userClient.delete(`${url}/${arg}`);

const updateUserGeojson = async (url: string, { arg }: { arg: any }) =>
  userClient.put(`${url}/${arg.geojson.id}`, JSON.stringify(arg));

const stripeCheckout = async (url: string, { arg }: { arg: any }) =>
  userClient.post(url, JSON.stringify(arg));

export const useUserProfile = () => {
  const { data, error, isLoading } = useSWR(UserEndpoint.USER_URL, fetcher);
  return {
    profile: data?.data,
    isLoading,
    isError: error,
  };
};

export const useUserAvatar = (fbUID: string) => {
  const { data, error, isLoading } = useSWR(
    `${UserEndpoint.USER_AVATAR}?id=${fbUID}&isRound=1&isUrl=1`,
    fetcher,
  );
  return {
    url: data?.data.url,
    isLoading,
    isError: error,
  };
};

export const useUserProfileMutation = () => {
  const { trigger, isMutating } = useSWRMutation(UserEndpoint.USER_URL, registerUser, {
    onSuccess: () => {
      mutate(UserQueryKeys.fetchUser);
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });
  return {
    trigger,
    isMutating,
  };
};

export const useUserUpdateProfile = () => {
  const { trigger, isMutating } = useSWRMutation(
    UserEndpoint.USER_URL,
    async (payload: any) => userClient.post(UserEndpoint.USER_URL, JSON.stringify(payload)),
    {
      onSuccess: () => {
        mutate(UserQueryKeys.fetchUser);
      },
      onError: error => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    },
  );
  return {
    trigger,
    isMutating,
  };
};

export const useUserGeojson = () => {
  const { data, error, isLoading } = useSWR(
    `${UserEndpoint.USER_GEOJSON}/${useSessionInfoStore.getState().sessionId}`,
    fetcher,
  );
  return {
    features: data?.data?.features,
    isLoading,
    isError: error,
  };
};

export const useUserGeojsonMutation = () => {
  const { trigger, isMutating } = useSWRMutation(UserEndpoint.USER_GEOJSON, addUserGeojson, {
    onSuccess: () => {
      mutate(`${UserEndpoint.USER_GEOJSON}/${useSessionInfoStore.getState().sessionId}`);
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });
  return {
    trigger,
    isMutating,
  };
};

export const useUpdateUserGeojsonMutation = () => {
  const { trigger, isMutating } = useSWRMutation(UserEndpoint.USER_GEOJSON, updateUserGeojson, {
    onSuccess: () => {
      mutate(`${UserEndpoint.USER_GEOJSON}/${useSessionInfoStore.getState().sessionId}`);
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });
  return {
    trigger,
    isMutating,
  };
};

export const useDeleteUserGeojsonMutation = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${UserEndpoint.USER_GEOJSON}`,
    deleteUserGeojson,
    {
      onSuccess: () => {
        mutate(`${UserEndpoint.USER_GEOJSON}/${useSessionInfoStore.getState().sessionId}`);
      },
      onError: error => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    },
  );
  return {
    trigger,
    isMutating,
  };
};

export const useAddCreditMutation = () => {
  const { trigger, data, isMutating } = useSWRMutation(
    UserEndpoint.USER_STRIPE_CHECKOUT,
    stripeCheckout,
    {
      onSuccess: () => {
        mutate(`${UserEndpoint.USER_STRIPE_CHECKOUT}`);
      },
      onError: error => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    },
  );
  return {
    data,
    trigger,
    isMutating,
  };
};
