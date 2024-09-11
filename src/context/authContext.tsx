'use client';

import { createContext } from 'react';
import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth as firebaseAuth } from '@/utils/firebase';
import { AppConfig } from '@/AppConfig';
import { useUserProfileMutation } from '@/hooks/users';
import useSettingsStore from '@/zustand/useSettingsStore';

const googleAuthProvider = new GoogleAuthProvider();

interface AuthContextProps {
  user: User | null | undefined;
  handleLogout: () => void;
  handleGoogleLogin: () => Promise<void>;
  loading: boolean;
  error: any | null;
}

export const AuthContext = createContext({} as AuthContextProps);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, loading, error] = useAuthState(firebaseAuth);
  const registerProfileMutation = useUserProfileMutation();
  const setIsProfileModalVisible = useSettingsStore(state => state.setIsProfileModalVisible);
  const setIsTopProfileModalVisible = useSettingsStore(state => state.setIsTopProfileModalVisible);

  const handleLogout = () => firebaseAuth.signOut();

  const handleGoogleLogin = async () => {
    try {
      setIsProfileModalVisible(false);
      setIsTopProfileModalVisible(false);
      const response = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const names = response.user.displayName?.split(' ');
      const profile = {
        email: response.user.email,
        first_name: names && names.length > 0 ? names[0] : undefined,
        last_name: names && names.length > 1 ? names[1] : undefined,
      };
      await registerProfileMutation.trigger(profile);
    } catch (err: any) {
      const errorMessage = err.message;
      const email = err.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(err);

      if (AppConfig.mode !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error signing in with Google:', errorMessage, email, credential);
      }
    }
  };

  const state = {
    user,
    loading,
    error,
    handleLogout,
    handleGoogleLogin,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
