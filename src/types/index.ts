export type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

export type BrowseType =
    | "MUSIC_PAGE_TYPE_ARTIST"
    | "MUSIC_PAGE_TYPE_ARTIST_DISCOGRAPHY"
    | "MUSIC_PAGE_TYPE_USER_CHANNEL"
    | "MUSIC_PAGE_TYPE_ALBUM"
    | "MUSIC_PAGE_TYPE_PLAYLIST";

export type Browse = {
    browseId: string;
    browseEndpointContextSupportedConfigs: {
        browseEndpointContextMusicConfig: {
            pageType: BrowseType;
        };
    };
};

export type WatchIdWithPlaylistId = {
    watchId: string;
    playlistId: string;
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

export type Item = ItemWithWatch | ItemWithBrowse;

// #region search
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

export type SearchResult = {
    searchType: SearchType;
    results: Item[];
    continuation?: string;
};

export type SearchSuggestions = {
    text: { text: string; bold: boolean }[];
    items: Item[];
};
// #endregion

// #region browse
export type PageSection = {
    title: string;
    items: Item[];
    moreBrowseEndpoints?: Browse;
};

export type DescriptionSection = {
    header: { text: string }[];
    subHeader: { text: string }[];
    description: { text: string }[];
};

export type ArtistChannelPageType = {
    browse: Browse;
    title: string;
    thumbnails: Thumbnail[];
    radioEndpoint?: WatchIdWithPlaylistId;
    playEndpoint?: WatchIdWithPlaylistId;
    sections: PageSection[];
    descriptionSection?: DescriptionSection;
};

export type ArtistDiscographyPageType = {
    browse: Browse;
    title: string;
    items: Item[];
};

export type AlbumPlaylistPageType = {
    browse: Browse;
    thumbnails: Thumbnail[];
    title: string;
    subTitles: ItemSubTitle[];
    sections: PageSection[];
    descriptionSection?: DescriptionSection;
};
// #endregion
