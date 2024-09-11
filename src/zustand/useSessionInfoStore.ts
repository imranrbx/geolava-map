import { generateSessionId } from '@/utils/common';
import axios from 'axios';
import { create } from 'zustand';

interface SessionInfoStore {
  sessionId?: string;
  setSessionId: (payload: string) => void;
}

export default create<SessionInfoStore>()(set => ({
  sessionId: generateSessionId(),
  setSessionId: id => {
    set({ sessionId: id });
    axios.defaults.headers.common['sess-id'] = id;
  },
}));
