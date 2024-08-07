export type SearchBody = {
  query: string
  type: SearchType
}

export type ContinuationBody = {
  continuation: string
  type: SearchType
}

export type SearchType =
  | 'SEARCH_TYPE_SONG'
  | 'SEARCH_TYPE_VIDEO'
  | 'SEARCH_TYPE_ARTIST'
  | 'SEARCH_TYPE_PLAYLIST'
  | 'SEARCH_TYPE_ALBUM'

export type SearchResult = {
  contents: Content[]
  continuation: string
}

export type Content = Song | Video | Artist | Album | Playlist

export type Song = {
  thumbnail: Thumbnail[]
  title: string
  watchEndpoint: WatchEndpoint
  artist: ArtistBasic[]
  duration: string
  plays: string
}

export type Video = {
  thumbnail: Thumbnail[]
  title: string
  watchEndpoint: WatchEndpoint
  artist: ArtistBasic[]
  duration: string
  views: string
}

export type Artist = {
  thumbnail: Thumbnail[]
  title: string
  browserEndpoint: BrowserEndPoint
  subscribers: string
}

export type Album = {
  thumbnail: Thumbnail[]
  title: string
  artist: ArtistBasic[]
  year: string
  browserEndpoint: BrowserEndPoint
}

export type Playlist = {
  thumbnail: Thumbnail[]
  title: string
  artist: ArtistBasic[]
  browserEndpoint: BrowserEndPoint
}

export type Single = {
  thumbnail: Thumbnail[]
  title: string
  year: string
  browserEndpoint: BrowserEndPoint
}

export type Thumbnail = {
  url: string
  width: number
  height: number
}

export type WatchEndpoint = {
  videoId: string
  playlistId: string
  watchEndpointMusicSupportedConfigs: {
    watchEndpointMusicConfig: {
      musicVideoType: MusicVideoType
    }
  }
}

export type ArtistBasic = {
  name: string
  browserEndPoint: BrowserEndPoint
}

export type BrowserEndPoint = {
  browseId: string
  params?: string
  browseEndpointContextSupportedConfigs: {
    browseEndpointContextMusicConfig: {
      pageType: PageType
    }
  }
}

export type ArtistPage = {
  name: string
  description: string
  thumbnail: Thumbnail[]
  shuffleEndpoint: any
  radioEndpoint: any
  songs: Song[]
  songsEndpoint: BrowserEndPoint
  albums: Album
  albumsEndpoint: BrowserEndPoint
  singles: Single[]
  singlesEndpoint: BrowserEndPoint
}

export type AlbumPage = {
  thumbnail: Thumbnail[]
  title: string
  artist: ArtistBasic[]
  year: string
  description: string
  songs: Song[]
  totalDuration: string
}

export type PlaylistPage = {
  thumbnail: Thumbnail[]
  title: string
  videos: Video[]
  totalDuration: string
  continuation: string
}

export type VideoDetailsFromPlayer = {
  playabilityStatus: {
    status: string
  }
  videoDetails: {
    videoId: string
    title: string
    lengthSeconds: number
    channelId: string
    thumbnail: {
      thumbnails: Thumbnail[]
    }
    viewCount: number
    author: string
  }
  playerConfig: {
    audioConfig: {
      loudnessDb: number
      perceptualLoudnessDb: number
      enablePerFormatLoudness: boolean
    }
  }
}

export type AudioStream = {
  url: string
  format: string
  quality: string
  mimeType: string
  itag: number
  bitrate: number
  initStart: number
  initEnd: number
  indexStart: number
  indexEnd: number
  contentLength: number
}

type MusicVideoType = 'MUSIC_VIDEO_TYPE_ATV' | 'MUSIC_VIDEO_TYPE_UGC'
type PageType =
  | 'MUSIC_PAGE_TYPE_ARTIST'
  | 'MUSIC_PAGE_TYPE_USER_CHANNEL'
  | 'MUSIC_PAGE_TYPE_PLAYLIST'
