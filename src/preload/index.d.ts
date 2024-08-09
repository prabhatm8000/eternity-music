import { ElectronAPI } from '@electron-toolkit/preload';
import { SearchBody, SearchResult } from '../main/innerTube/types.js';
import { InnerTubeAPI } from './APIs/types.js';

declare global {
    interface Window {
        electron: ElectronAPI;
        innerTube: InnerTubeAPI;
    }
}
