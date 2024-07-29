export type SearchBody = {
    query: string;
    type: SearchType;
};

export type ContinuationBody = {
    continuation: string;
    type: SearchType;
};

export type SearchType =
    | "SEARCH_TYPE_SONG"
    | "SEARCH_TYPE_VIDEO"
    | "SEARCH_TYPE_ARTIST"
    | "SEARCH_TYPE_PLAYLIST"
    | "SEARCH_TYPE_ALBUM";

export type SearchResult = {
    contents: Content[];
    continuation: string;
};

export type Content = Song | Video | Artist | Album;

export type Song = {
    thumbnail: Thumbnail[];
    title: string;
    watchEndpoint: WatchEndpoint;
    artist: ArtistBasic[];
    duration: string;
    plays: string;
};

export type Video = {
    thumbnail: Thumbnail[];
    title: string;
    watchEndpoint: WatchEndpoint;
    artist: ArtistBasic[];
    duration: string;
    views: string;
};

export type Artist = {
    thumbnail: Thumbnail[];
    title: string;
    browserEndpoint: BrowserEndPoint;
    subscribers: string;
}

export type Album = {
    thumbnail: Thumbnail[];
    title: string;
    artist: ArtistBasic[];
    year: string;
    browserEndpoint: BrowserEndPoint;
}

export type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

export type WatchEndpoint = {
    videoId: string;
    watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
            musicVideoType: MusicVideoType;
        };
    };
};

export type ArtistBasic = {
    name: string;
    browserEndPoint: BrowserEndPoint;
};

export type BrowserEndPoint = {
    browseId: string;
    browseEndpointContextSupportedConfigs: {
        browseEndpointContextMusicConfig: {
            pageType: PageType;
        };
    };
};

type MusicVideoType = "MUSIC_VIDEO_TYPE_ATV" | "MUSIC_VIDEO_TYPE_UGC";
type PageType = "MUSIC_PAGE_TYPE_ARTIST" | "MUSIC_PAGE_TYPE_USER_CHANNEL";
