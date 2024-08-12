export type ViewType = 'HOME' | 'SEARCH' | 'LIBRARY' | 'SETTINGS' | 'HELP';

export type ContinuationBody = {
    continuation: string;
    type: SearchType;
};

export type SearchType =
    | 'SEARCH_TYPE_SONG'
    | 'SEARCH_TYPE_VIDEO'
    | 'SEARCH_TYPE_ARTIST'
    | 'SEARCH_TYPE_PLAYLIST'
    | 'SEARCH_TYPE_ALBUM';

export type SearchResult = {
    query: string | 'SEARCH_RESULT_FROM_CONTINUATION';
    contents: Content[];
    continuation: string;
};

export type Content = Song | Video | Artist | Album | Playlist;

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
};

export type Album = {
    thumbnail: Thumbnail[];
    title: string;
    artist: ArtistBasic[];
    year: string;
    browserEndpoint: BrowserEndPoint;
};

export type Playlist = {
    thumbnail: Thumbnail[];
    title: string;
    artist: ArtistBasic[];
    browserEndpoint: BrowserEndPoint;
};

export type Single = {
    thumbnail: Thumbnail[];
    title: string;
    year: string;
    browserEndpoint: BrowserEndPoint;
};

export type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

export type WatchEndpoint = {
    videoId: string;
    playlistId: string;
    watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
            musicVideoType: string;
        };
    };
};

export type ArtistBasic = {
    name: string;
    browserEndPoint: BrowserEndPoint;
};

export type BrowserEndPoint = {
    browseId: string;
    params?: string;
    browseEndpointContextSupportedConfigs: {
        browseEndpointContextMusicConfig: {
            pageType: string;
        };
    };
};

export type BrowseBody = {
    browseId: string;
    pageType: 'ALBUM' | 'ARTIST' | 'PLAYLIST';
};

export type ArtistPage = {
    browseId: string;
    name: string;
    description: string;
    thumbnail: Thumbnail[];
    shuffleEndpoint: any;
    radioEndpoint: any;
    songs: Song[];
    songsEndpoint: BrowserEndPoint;
    albums: Album;
    albumsEndpoint: BrowserEndPoint;
    singles: Single[];
    singlesEndpoint: BrowserEndPoint;
};

export type AlbumPage = {
    browseId: string;
    thumbnail: Thumbnail[];
    title: string;
    artist: ArtistBasic[];
    year: string;
    description: string;
    songs: Song[];
    totalDuration: string;
};

export type PlaylistPage = {
    browseId: string;
    thumbnail: Thumbnail[];
    title: string;
    videos: Video[];
    artist: ArtistBasic[];
    totalTracks: number;
    totalDuration: string;
    continuation: string;
};

export type VideoDetailsFromPlayer = {
    playabilityStatus: {
        status: string;
    };
    videoDetails: {
        videoId: string;
        title: string;
        lengthSeconds: number;
        channelId: string;
        thumbnail: {
            thumbnails: Thumbnail[];
        };
        viewCount: number;
        author: string;
    };
    playerConfig: {
        audioConfig: {
            loudnessDb: number;
            perceptualLoudnessDb: number;
            enablePerFormatLoudness: boolean;
        };
    };
};

export type AudioStream = {
    url: string;
    format: string;
    quality: string;
    mimeType: string;
    itag: number;
    bitrate: number;
    initStart: number;
    initEnd: number;
    indexStart: number;
    indexEnd: number;
    contentLength: number;
};
