import { create } from 'zustand';

interface Chat {
  chatId: string;
  question?: string | undefined;
  answer?: string | undefined;
  metadata?: any;
}

interface initialQuestion {
  question: string;
  icon_url: string;
  background: string;
}

interface ChatStoreValues {
  chat: Chat[];
  setChat: (payload: Chat[]) => void;
  followUp: string[];
  setFollowUp: (payload: string[]) => void;
  resetChat: () => void;
  blobURL: string | undefined;
  setBlobURL: (payload: string) => void;
  initialQuestion: initialQuestion[];
}

/**
 * A custom hook that creates a Zustand store for managing chat-related state.
 * @returns An object containing the store's state values and setter functions.
 */
const useChatStore = create<ChatStoreValues>()(set => ({
  chat: [],
  setChat: payload => set(() => ({ chat: payload })),
  followUp: [],
  setFollowUp: payload => set(() => ({ followUp: payload })),
  resetChat: () => {
    set(() => ({ chat: [], followUp: [] }));
  },
  blobURL: undefined,
  setBlobURL: payload => set(() => ({ blobURL: payload })),
  initialQuestion: [
    {
      question: 'What’s the roof condition of 3655 Lawton St, San Francisco, CA 94122',
      icon_url: '/chat/roof-icon.svg',
      background: 'bg-[#D5EAFF]',
    },
    {
      question: 'What’s the property value of 3655 Lawton St, San Francisco, CA 94122',
      icon_url: '/chat/home-icon.svg',
      background: 'bg-[#D8FBDE]',
    },
    {
      question: 'Properties with vegetation touching electrical wires',
      icon_url: '/chat/emergency-icon.svg',
      background: 'bg-[#F4E3D4]',
    },
  ],
}));

export default useChatStore;
