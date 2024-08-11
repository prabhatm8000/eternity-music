import { ipcRenderer } from 'electron/renderer';
import type {
    AlbumPage,
    ArtistPage,
    BrowseBody,
    ContinuationBody,
    PlaylistPage,
    SearchBody,
    SearchResult
} from '../../main/innerTube/types';
import type { InnerTubeAPI } from './types';

export const innerTubeAPI: InnerTubeAPI = {
    search: (
        searchBody: SearchBody | ContinuationBody,
        callback: (searchResult: SearchResult) => void
    ) => {
        ipcRenderer.send('search', searchBody);
        ipcRenderer.once('search-reply', (_event, searchResult: SearchResult) =>
            callback(searchResult)
        );
    },
    searchSuggestions: (query: string, callback: (searchSuggestions: string[]) => void) => {
        ipcRenderer.send('search-suggestions', query);
        ipcRenderer.once('search-suggestions-reply', (_event, searchSuggestions: string[]) =>
            callback(searchSuggestions)
        );
    },
    browse: (
        browseBody: BrowseBody,
        callback: (browseResult: ArtistPage | AlbumPage | PlaylistPage | null) => void
    ) => {
        ipcRenderer.send('browse', browseBody);
        ipcRenderer.once(
            'browse-reply',
            (_event, browseResult: ArtistPage | AlbumPage | PlaylistPage | null) =>
                callback(browseResult)
        );
    }
};
