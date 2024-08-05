export const ApiPaths = {
    browse: "/youtubei/v1/browse",
    next: "/youtubei/v1/next",
    player: "/youtubei/v1/player",
    queue: "/youtubei/v1/music/get_queue",
    search: "/youtubei/v1/search",
    searchSuggestions: "/youtubei/v1/music/get_search_suggestions",
};

export const searchFilterParams = {
    Song: "EgWKAQIIAWoQEAMQBBAFEAkQChAREBAQFQ%3D%3D",
    Video: "EgWKAQIQAWoKEAkQChAFEAMQBA%3D%3D",
    Album: "EgWKAQIYAWoKEAkQChAFEAMQBA%3D%3D",
    Artist: "EgWKAQIgAWoKEAkQChAFEAMQBA%3D%3D",
    CommunityPlaylist: "EgeKAQQoAEABagoQAxAEEAoQCRAF",
    FeaturedPlaylist: "EgeKAQQoADgBagwQDhAKEAMQBRAJEAQ%3D",
};

export const musicResponsiveListItemRendererMask =
    "musicResponsiveListItemRenderer(flexColumns,fixedColumns,thumbnail,navigationEndpoint)";
export const musicTwoRowItemRendererMask =
    "musicTwoRowItemRenderer(thumbnailRenderer,title,subtitle,navigationEndpoint)";
export const playlistPanelVideoRendererMask =
    "playlistPanelVideoRenderer(title,navigationEndpoint,longBylineText,shortBylineText,thumbnail,lengthText)";

export const XGoogApiKey = process.env.Inner_Youtube_Api_Key;

export const MAX_RETRY = 3;