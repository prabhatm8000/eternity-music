import type {
    AlbumPage,
    ArtistPage,
    BrowseBody,
    ContinuationBody,
    PlaylistPage,
    SearchBody,
    SearchResult
} from '../../main/innerTube/types';

export type InnerTubeAPI = {
    search: (
        searchBody: SearchBody | ContinuationBody,
        callback: (searchResult: SearchResult) => void
    ) => void;
    searchSuggestions: (input: string, callback: (searchSuggestions: string[]) => void) => void;
    browse: (
        browseBody: BrowseBody,
        callback: (browseResult: ArtistPage | AlbumPage | PlaylistPage | null) => void
    ) => void;
};
