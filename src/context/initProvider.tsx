'use client';

import { createContext } from 'react';
import '../init/axios.defaults';

interface InitContextProps {}

export const InitContext = createContext({} as InitContextProps);

interface InitProviderProps {
  children: React.ReactNode;
}

export function InitContextProvider({ children }: InitProviderProps) {
  return <InitContext.Provider value={{}}>{children}</InitContext.Provider>;
}
