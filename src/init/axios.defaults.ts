import axios from 'axios';
import useSessionInfoStore from '@/zustand/useSessionInfoStore';
import { AppConfig } from '@/AppConfig';

axios.defaults.headers.common['gl-src-app'] = AppConfig.firebaseConfig.projectId || 'lava_unknown';
axios.defaults.headers.common.app = AppConfig.firebaseConfig.projectId || 'lava_unknown';
axios.defaults.headers.common['sess-id'] = useSessionInfoStore.getState().sessionId;
