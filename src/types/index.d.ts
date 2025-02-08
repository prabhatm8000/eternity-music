export type SearchType =
    | "SONGS"
    | "ALBUMS"
    | "ARTISTS"
    | "PLAYLISTS"
    | "VIDEOS";

export type SearchQuery = {
    query?: string;
    searchType: SearchType;
    continuation?: string;
};

export type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

export type BrowseType = "MUSIC_PAGE_TYPE_ARTIST" | "MUSIC_PAGE_TYPE_USER_CHANNEL" | "MUSIC_PAGE_TYPE_ALBUM";

export type Browse = {
    browseId: string;
    browseEndpointContextSupportedConfigs: {
        browseEndpointContextMusicConfig: {
            pageType: BrowseType;
        };
    };
};

export type ItemSubTitle = {
    text: string;
    browse?: Browse;
};

export type ItemWithWatch = {
    watchId: string;
    title: string;
    thumbnails?: Thumbnail[];
    subTitles?: ItemSubTitle[];
};

export type ItemWithBrowse = {
    browse: Browse;
    title: string;
    thumbnails?: Thumbnail[];
    subTitles?: ItemSubTitle[];
};

export type SearchItem = ItemWithWatch | ItemWithBrowse;

export type SearchResult = {
    searchType: SearchType;
    results: SearchItem[];
    continuation?: string;
};
