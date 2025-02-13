const ApiBaseUrl = "https://music.youtube.com";
const ApiPaths = {
    searchSuggestions: "/youtubei/v1/music/get_search_suggestions",
    search: "/youtubei/v1/search",
    browse: "/youtubei/v1/browse",
    next: "/youtubei/v1/next",
    player: "/youtubei/v1/player",
    queue: "/youtubei/v1/music/get_queue",
};
const searchFilterParams = {
    Song: "EgWKAQIIAWoQEAMQBBAFEAkQChAREBAQFQ%3D%3D",
    Video: "EgWKAQIQAWoKEAkQChAFEAMQBA%3D%3D",
    Album: "EgWKAQIYAWoKEAkQChAFEAMQBA%3D%3D",
    Artist: "EgWKAQIgAWoKEAkQChAFEAMQBA%3D%3D",
    CommunityPlaylist: "EgeKAQQoAEABagoQAxAEEAoQCRAF",
    FeaturedPlaylist: "EgeKAQQoADgBagwQDhAKEAMQBRAJEAQ%3D",
};
const musicResponsiveListItemRendererMask =
    "musicResponsiveListItemRenderer(flexColumns,fixedColumns,thumbnail,navigationEndpoint)";
const musicTwoRowItemRendererMask =
    "musicTwoRowItemRenderer(thumbnailRenderer,title,subtitle,navigationEndpoint)";
const playlistPanelVideoRendererMask =
    "playlistPanelVideoRenderer(title,navigationEndpoint,longBylineText,shortBylineText,thumbnail,lengthText)";
const XGoogApiKey = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
const MAX_RETRY = 3;

export default {
    ApiBaseUrl,
    ApiPaths,
    searchFilterParams,
    musicResponsiveListItemRendererMask,
    musicTwoRowItemRendererMask,
    playlistPanelVideoRendererMask,
    XGoogApiKey,
    MAX_RETRY,
};
