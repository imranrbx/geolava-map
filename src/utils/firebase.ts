import { AppConfig } from '@/AppConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp(AppConfig.firebaseConfig);

export const auth = getAuth(app);

export const getAuthorizationToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      return `Bearer ${token}`;
    }
    return '';
  } catch (error) {
    return '';
  }
};

export const getFirebaseUUID = () => {
  const user = auth.currentUser;

  if (!user) {
    return '';
  }

  return user.uid;
};

export const getToken = async () => {
  const user = auth.currentUser;

  if (!user) {
    return '';
  }

  return user.getIdToken();
};
