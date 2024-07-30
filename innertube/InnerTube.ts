import { writeFileSync } from "fs";
import {
    ApiPaths,
    musicResponsiveListItemRendererMask,
    searchFilterParams,
    XGoogApiKey,
} from "./configs";
import type {
    Album,
    ArtistBasic,
    ArtistPage,
    BrowserEndPoint,
    Content,
    ContinuationBody,
    SearchBody,
    SearchResult,
    SearchType,
    Single,
    Thumbnail,
    WatchEndpoint,
} from "./types";

export default class InnerTube {
    constructor() {}

    reqBody: SearchBody | ContinuationBody;

    async search(
        reqBody: SearchBody | ContinuationBody
    ): Promise<SearchResult> {
        this.reqBody = reqBody;

        let params: string | null;

        switch (this.reqBody.type) {
            case "SEARCH_TYPE_SONG":
                params = searchFilterParams.Song;
                break;
            case "SEARCH_TYPE_VIDEO":
                params = searchFilterParams.Video;
                break;
            case "SEARCH_TYPE_ARTIST":
                params = searchFilterParams.Artist;
                break;
            case "SEARCH_TYPE_PLAYLIST":
                params = searchFilterParams.CommunityPlaylist;
                break;
            case "SEARCH_TYPE_ALBUM":
                params = searchFilterParams.Album;
                break;
            default:
                params = null;
        }

        const continuation =
            "continuation" in reqBody ? reqBody.continuation : null;

        const res = await fetch(
            `https://music.youtube.com${
                ApiPaths.search
            }?ctoken=${continuation}&continuation=${continuation}&type=${
                continuation ? "next" : null
            }&prettyPrint=false`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "X-Goog-Api-Key": XGoogApiKey,

                    // masking the non-required fields
                    "X-Goog-FieldMask": continuation
                        ? `continuationContents.musicShelfContinuation(continuations,contents.${musicResponsiveListItemRendererMask})`
                        : `contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer(continuations,contents.${musicResponsiveListItemRendererMask})`,
                    Accept: "*/*",
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: "WEB_REMIX",
                            clientVersion: "1.20240724.00.00",
                            hl: "en",
                        },
                    },
                    query: "query" in reqBody ? reqBody.query : null,
                    params,
                }),
            }
        );

        console.log(
            "api call: search;",
            "requestBody:",
            reqBody,
            "status:",
            res.status,
            res.statusText
        );

        const jsonData = await res.json();

        const data = continuation
            ? jsonData.continuationContents
            : jsonData.contents?.tabbedSearchResultsRenderer?.tabs[0]
                  ?.tabRenderer.content.sectionListRenderer.contents[0];

        const searchResult: SearchResult = {
            contents: continuation
                ? data?.musicShelfContinuation?.contents?.map((content) =>
                      this.filterAndOrganizeSearchResult(content, reqBody.type)
                  )
                : data?.musicShelfRenderer?.contents?.map((content) =>
                      this.filterAndOrganizeSearchResult(content, reqBody.type)
                  ),
            continuation: data?.musicShelfRenderer?.continuations
                ? data?.musicShelfRenderer?.continuations[0]
                      ?.nextContinuationData?.continuation
                : [],
        };

        return searchResult;
    }

    private filterAndOrganizeSearchResult(content, type: SearchType): Content {
        let thumbnail: Thumbnail[],
            title: string,
            watchEndpoint: WatchEndpoint,
            browserEndpoint: BrowserEndPoint,
            artist: ArtistBasic[],
            infoData: any,
            duration: string,
            plays: string,
            views: string,
            subscribers: string,
            year: string;

        thumbnail =
            content?.musicResponsiveListItemRenderer?.thumbnail
                ?.musicThumbnailRenderer?.thumbnail?.thumbnails;

        title =
            content?.musicResponsiveListItemRenderer?.flexColumns[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
                ?.text;

        infoData =
            content?.musicResponsiveListItemRenderer?.flexColumns[1]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;

        if (
            type === "SEARCH_TYPE_SONG" ||
            type === "SEARCH_TYPE_VIDEO" ||
            type === "SEARCH_TYPE_PLAYLIST"
        ) {
            artist = [];

            for (let i = 0; i < infoData.length; i++) {
                if (
                    infoData[i]?.text.trim() === "," ||
                    infoData[i]?.text.trim() === "&"
                ) {
                    continue;
                }

                if (infoData[i]?.text.trim() !== "•") {
                    artist.push({
                        name: infoData[i]?.text,
                        browserEndPoint:
                            infoData[i]?.navigationEndpoint?.browseEndpoint,
                    });
                } else {
                    break;
                }
            }
        }

        if (type === "SEARCH_TYPE_SONG" || type === "SEARCH_TYPE_VIDEO") {
            watchEndpoint =
                content?.musicResponsiveListItemRenderer?.flexColumns[0]
                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
                    ?.navigationEndpoint?.watchEndpoint;

            duration = infoData[infoData.length - 1]?.text;
        }

        if (
            type === "SEARCH_TYPE_ALBUM" ||
            type === "SEARCH_TYPE_ARTIST" ||
            type === "SEARCH_TYPE_PLAYLIST"
        ) {
            browserEndpoint =
                content?.musicResponsiveListItemRenderer?.navigationEndpoint
                    ?.browseEndpoint;
        }

        if (type === "SEARCH_TYPE_SONG") {
            plays =
                content?.musicResponsiveListItemRenderer?.flexColumns[2]
                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
                    ?.text;
        }

        if (type === "SEARCH_TYPE_VIDEO") {
            views = infoData[2]?.text;
        }

        if (type === "SEARCH_TYPE_ARTIST") {
            subscribers = infoData[2]?.text;
        }

        if (type === "SEARCH_TYPE_ALBUM") {
            artist = [];

            artist.push({
                name: infoData[2].text,
                browserEndPoint:
                    infoData[2]?.navigationEndpoint?.browseEndpoint,
            });

            year = infoData[4]?.text;
        }

        return {
            thumbnail,
            title,
            artist,
            watchEndpoint,
            browserEndpoint,
            duration,
            plays,
            views,
            subscribers,
            year,
        };
    }

    async browse(
        browseId: string,
        pageType: "ALBUM" | "ARTIST"
    ): Promise<ArtistPage | null> {
        const res = await fetch(
            `https://music.youtube.com${ApiPaths.browse}?prettyPrint=false`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": XGoogApiKey,

                    // masking the non-required fields
                    "X-Goog-FieldMask": "contents,header",
                    Accept: "*/*",
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: "WEB_REMIX",
                            clientVersion: "1.20240724.00.00",
                            hl: "en",
                        },
                    },
                    browseId: browseId,
                }),
            }
        );

        console.log(
            "api call: browse;",
            "browseId:",
            browseId,
            "pageType:",
            pageType,
            "status:",
            res.status,
            res.statusText
        );

        const jsonData = await res.json();

        writeFileSync("./testingData/1-data.json", JSON.stringify(jsonData));

        if (pageType === "ARTIST") {
            const output: ArtistPage = {
                name: jsonData?.header?.musicImmersiveHeaderRenderer?.title
                    ?.runs[0]?.text,
                description:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.description
                        ?.runs[0]?.text,
                thumbnail:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.thumbnail
                        ?.musicThumbnailRenderer?.thumbnail?.thumbnails,
                shuffleEndpoint:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.playButton
                        ?.buttonRenderer?.navigationEndpoint?.watchEndpoint,
                radioEndpoint:
                    jsonData?.header?.musicImmersiveHeaderRenderer
                        ?.startRadioButton?.buttonRenderer?.navigationEndpoint
                        ?.watchEndpoint,
                songs: jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.musicShelfRenderer?.contents.map(
                    (content) =>
                        this.filterAndOrganizeSearchResult(
                            content,
                            "SEARCH_TYPE_SONG"
                        )
                ),
                songsEndpoint:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer
                        ?.tabs[0]?.tabRenderer?.content?.sectionListRenderer
                        ?.contents[0]?.musicShelfRenderer?.bottomEndpoint
                        ?.browseEndpoint,
                albums: jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[1]?.musicCarouselShelfRenderer?.contents.map(
                    (content) => this.filterAndOrganizeSinglesAndAlbums(content)
                ),
                albumsEndpoint:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer
                        ?.tabs[0]?.tabRenderer?.content?.sectionListRenderer
                        ?.contents[1]?.musicCarouselShelfRenderer?.header
                        ?.musicCarouselShelfBasicHeaderRenderer
                        ?.moreContentButton?.buttonRenderer?.navigationEndpoint
                        ?.browseEndpoint,
                singles:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[2]?.musicCarouselShelfRenderer?.contents.map(
                        (content) =>
                            this.filterAndOrganizeSinglesAndAlbums(content)
                    ),
                singlesEndpoint:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer
                        ?.tabs[0]?.tabRenderer?.content?.sectionListRenderer
                        ?.contents[2]?.musicCarouselShelfRenderer?.header
                        ?.musicCarouselShelfBasicHeaderRenderer
                        ?.moreContentButton?.buttonRenderer?.navigationEndpoint
                        ?.browseEndpoint,
            };

            return output;
        }

        if (pageType === "ALBUM") {
            
        }

        return null;
    }

    private filterAndOrganizeSinglesAndAlbums(content): Single | Album {
        const data = content?.musicTwoRowItemRenderer;
        return {
            thumbnail:
                data?.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail
                    ?.thumbnails,
            title: data?.title?.runs[0]?.text,
            year: data?.subtitle?.runs[data?.subtitle?.runs.length - 1]?.text,
            browserEndpoint: data?.navigationEndpoint?.browseEndpoint,
        };
    }
}
