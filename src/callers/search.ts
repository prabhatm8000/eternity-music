import constants from "../constants";
import { CallerDataFilterationError } from "../errors/caller";
import fetcher from "../helper/fetcher";
import {
    type SearchQuery,
    type SearchResult,
    type ItemSubTitle,
    type SearchItem,
} from "../types";

export default async function Search(
    searchProps: SearchQuery
): Promise<SearchResult> {
    try {
        let params: string | null;

        switch (searchProps.searchType) {
            case "SONGS":
                params = constants.searchFilterParams.Song;
                break;
            case "VIDEOS":
                params = constants.searchFilterParams.Video;
                break;
            case "ARTISTS":
                params = constants.searchFilterParams.Artist;
                break;
            case "ALBUMS":
                params = constants.searchFilterParams.Album;
                break;
            case "PLAYLISTS":
                params = constants.searchFilterParams.CommunityPlaylist;
                break;
            default:
                params = null;
        }

        const continuation = searchProps.continuation;

        const url = `${constants.ApiBaseUrl}${
            constants.ApiPaths.search
        }?ctoken=${continuation}&continuation=${continuation}&type=${
            continuation ? "next" : null
        }&prettyPrint=false`;

        const response = await fetcher({
            url,
            method: "POST",
            headers: {
                "X-Goog-FieldMask": continuation
                    ? `continuationContents.musicShelfContinuation(continuations,contents.${constants.musicResponsiveListItemRendererMask})`
                    : `contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer(continuations,contents.${constants.musicResponsiveListItemRendererMask})`,
            },
            payload: {
                params,
                query: searchProps.query,
            },
        });

        // if (continuation) return response;
        // return response;

        let result: SearchResult;

        switch (searchProps.searchType) {
            case "SONGS":
                result = filterSongs(response, !!continuation) as SearchResult;
                break;
            case "VIDEOS":
                result = filterVideos(response, !!continuation) as SearchResult;
                break;
            default:
                // for "ARTISTS", "ALBUMS", "PLAYLISTS
                result = filterArtistsAlbumsPlaylists(
                    response,
                    searchProps.searchType,
                    !!continuation
                ) as SearchResult;
        }

        return result;
    } catch (error) {
        throw new CallerDataFilterationError(error, "Error while Searching");
    }
}

function subTitlesCreator(itemRenderer: any, title: string): ItemSubTitle[] {
    const subTitles = Array<any>(0);
    itemRenderer?.flexColumns?.forEach((flexColumn: any) => {
        const item =
            flexColumn?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.map(
                (run: any) => {
                    return {
                        text: run?.text === title ? "" : run?.text,
                        browse: run?.navigationEndpoint?.browseEndpoint,
                    };
                }
            );
        if (!item) return;
        subTitles.push(...item);
    });
    return subTitles;
}

function filterSongs(response: any, continuation: boolean): SearchResult {
    const result: SearchResult = {
        searchType: "SONGS",
        results: [],
        continuation: undefined,
    };

    const renderer = !continuation
        ? response?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]
              ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
              ?.musicShelfRenderer
        : response?.continuationContents?.musicShelfContinuation;

    result.results = renderer?.contents?.map((content: any): SearchItem => {
        const itemRenderer = content?.musicResponsiveListItemRenderer;

        const title =
            itemRenderer?.flexColumns?.[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]
                ?.text;

        const subTitles = subTitlesCreator(itemRenderer, title);

        return {
            title,
            watchId:
                itemRenderer?.flexColumns?.[0]
                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]
                    ?.navigationEndpoint?.watchEndpoint?.videoId,
            thumbnails:
                itemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail
                    ?.thumbnails,
            subTitles,
        };
    });

    result.continuation =
        renderer?.continuations?.[0]?.nextContinuationData?.continuation;

    return result;
}

function filterVideos(response: any, continuation: boolean): SearchResult {
    const result: SearchResult = {
        searchType: "VIDEOS",
        results: [],
        continuation: undefined,
    };

    const renderer = !continuation
        ? response?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]
              ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
              ?.musicShelfRenderer
        : response?.continuationContents?.musicShelfContinuation;

    result.results = renderer?.contents?.map((content: any): SearchItem => {
        const itemRenderer = content?.musicResponsiveListItemRenderer;

        const title =
            itemRenderer?.flexColumns?.[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]
                ?.text;

        const watchId =
            itemRenderer?.flexColumns?.[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]
                ?.navigationEndpoint?.watchEndpoint?.videoId;

        const subTitles = subTitlesCreator(itemRenderer, title);

        return {
            watchId,
            title,
            thumbnails:
                itemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail
                    ?.thumbnails,
            subTitles,
        };
    });

    result.continuation =
        renderer?.continuations?.[0]?.nextContinuationData?.continuation;

    return result;
}

function filterArtistsAlbumsPlaylists(
    response: any,
    searchType: "ARTISTS" | "ALBUMS" | "PLAYLISTS",
    continuation: boolean
): SearchResult {
    const result: SearchResult = {
        searchType,
        results: [],
        continuation: undefined,
    };

    const renderer = !continuation
        ? response?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]
              ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
              ?.musicShelfRenderer
        : response?.continuationContents?.musicShelfContinuation;

    result.results = renderer?.contents?.map((content: any): SearchItem => {
        const itemRenderer = content?.musicResponsiveListItemRenderer;

        const browse = itemRenderer?.navigationEndpoint?.browseEndpoint;
        const title =
            itemRenderer?.flexColumns?.[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]
                ?.text;
        const thumbnails =
            itemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail
                ?.thumbnails;
        const subTitles = subTitlesCreator(itemRenderer, title);

        return {
            browse,
            title,
            thumbnails,
            subTitles,
        };
    });

    result.continuation =
        renderer?.continuations?.[0]?.nextContinuationData?.continuation;

    return result;
}
