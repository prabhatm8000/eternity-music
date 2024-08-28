import type { SearchResult, ViewType } from '@renderer/types';

interface AppSlice {
    view: ViewType;
    browse: {
        browseId: string;
        pageType: 'BROWSER_ALBUM' | 'BROWSER_ARTIST' | 'BROWSER_PLAYLIST';
    } | null;
    appLoading: boolean;
}

type SearchViewResulsForAllType = {
    songs: SearchResult | undefined;
    videos: SearchResult | undefined;
    artists: SearchResult | undefined;
    albums: SearchResult | undefined;
    playlists: SearchResult | undefined;
};

interface SearchSlice {
    searchQuery: string;
    tabIndexOnFocus: number;
    prevTabIndex: number;
    searchResults: SearchViewResulsForAllType;
}
