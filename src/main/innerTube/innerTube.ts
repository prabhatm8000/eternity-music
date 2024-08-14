import { writeFileSync } from 'fs';
import {
    ApiPaths,
    MAX_RETRY,
    musicResponsiveListItemRendererMask,
    searchFilterParams,
    XGoogApiKey
} from './configs';
import type {
    Album,
    AlbumPage,
    ArtistBasic,
    ArtistPage,
    AudioStream,
    BrowseBody,
    BrowserEndPoint,
    Content,
    ContinuationBody,
    PlaylistPage,
    SearchBody,
    SearchResult,
    SearchType,
    Single,
    Song,
    Thumbnail,
    Video,
    VideoDetailsFromPlayer,
    WatchEndpoint
} from './types';

export default class InnerTube {
    constructor() {}

    async search(reqBody: SearchBody | ContinuationBody): Promise<SearchResult> {
        let params: string | null;

        switch (reqBody.type) {
            case 'SEARCH_TYPE_SONG':
                params = searchFilterParams.Song;
                break;
            case 'SEARCH_TYPE_VIDEO':
                params = searchFilterParams.Video;
                break;
            case 'SEARCH_TYPE_ARTIST':
                params = searchFilterParams.Artist;
                break;
            case 'SEARCH_TYPE_PLAYLIST':
                params = searchFilterParams.CommunityPlaylist;
                break;
            case 'SEARCH_TYPE_ALBUM':
                params = searchFilterParams.Album;
                break;
            default:
                params = null;
        }

        const continuation = 'continuation' in reqBody ? reqBody.continuation : null;

        const res = await fetch(
            `https://music.youtube.com${
                ApiPaths.search
            }?ctoken=${continuation}&continuation=${continuation}&type=${
                continuation ? 'next' : null
            }&prettyPrint=false`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-Goog-Api-Key': XGoogApiKey,

                    // masking the non-required fields
                    'X-Goog-FieldMask': continuation
                        ? `continuationContents.musicShelfContinuation(continuations,contents.${musicResponsiveListItemRendererMask})`
                        : `contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer(continuations,contents.${musicResponsiveListItemRendererMask})`,
                    Accept: '*/*'
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: 'WEB_REMIX',
                            clientVersion: '1.20240724.00.00',
                            hl: 'en'
                        }
                    },
                    query: 'query' in reqBody ? reqBody.query : null,
                    params
                })
            }
        );

        console.log(
            'api call: search;',
            'requestBody:',
            reqBody,
            'status:',
            res.status,
            res.statusText
        );

        const jsonData = await res.json();

        // writeFileSync('./testingData.json', JSON.stringify(jsonData));

        const data = continuation
            ? jsonData.continuationContents
            : jsonData.contents?.tabbedSearchResultsRenderer?.tabs[0]?.tabRenderer.content.sectionListRenderer.contents.filter(
                  (content) => content?.musicShelfRenderer
              )[0];

        const searchResult: SearchResult = {
            query: 'query' in reqBody ? reqBody.query : 'SEARCH_RESULT_FROM_CONTINUATION',
            contents: continuation
                ? data?.musicShelfContinuation?.contents?.map((content) =>
                      this.filterAndOrganizeSearchResult(content, reqBody.type)
                  )
                : data?.musicShelfRenderer?.contents?.map((content) =>
                      this.filterAndOrganizeSearchResult(content, reqBody.type)
                  ),
            continuation: continuation
                ? data?.musicShelfContinuation?.continuations?.length > 0
                    ? data?.musicShelfContinuation?.continuations[0]?.nextContinuationData
                          ?.continuation
                    : undefined
                : data?.musicShelfRenderer?.continuations?.length > 0
                  ? data?.musicShelfRenderer?.continuations[0]?.nextContinuationData?.continuation
                  : undefined
        };

        return searchResult;
    }

    private filterAndOrganizeSearchResult(content, type: SearchType): Content {
        let thumbnail: Thumbnail[],
            title: string,
            watchEndpoint!: WatchEndpoint,
            browserEndpoint!: BrowserEndPoint,
            artist: ArtistBasic[] = [],
            infoData!: any,
            duration!: string,
            plays!: string,
            views!: string,
            subscribers!: string,
            year!: string;

        thumbnail =
            content?.musicResponsiveListItemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail
                ?.thumbnails;

        title =
            content?.musicResponsiveListItemRenderer?.flexColumns[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text;

        infoData =
            content?.musicResponsiveListItemRenderer?.flexColumns[1]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;

        if (
            type === 'SEARCH_TYPE_SONG' ||
            type === 'SEARCH_TYPE_VIDEO' ||
            type === 'SEARCH_TYPE_PLAYLIST'
        ) {
            for (let i = 0; i < infoData.length; i++) {
                if (infoData[i]?.text.trim() === ',' || infoData[i]?.text.trim() === '&') {
                    continue;
                }

                if (infoData[i]?.text.trim() !== '•') {
                    artist.push({
                        name: infoData[i]?.text,
                        browserEndPoint: infoData[i]?.navigationEndpoint?.browseEndpoint
                    });
                } else {
                    break;
                }
            }
        }

        if (type === 'SEARCH_TYPE_SONG' || type === 'SEARCH_TYPE_VIDEO') {
            watchEndpoint =
                content?.musicResponsiveListItemRenderer?.flexColumns[0]
                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.navigationEndpoint
                    ?.watchEndpoint;

            duration = infoData[infoData.length - 1]?.text;
        }

        if (
            type === 'SEARCH_TYPE_ALBUM' ||
            type === 'SEARCH_TYPE_ARTIST' ||
            type === 'SEARCH_TYPE_PLAYLIST'
        ) {
            title =
                content?.musicResponsiveListItemRenderer?.flexColumns[0]
                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text;
            browserEndpoint =
                content?.musicResponsiveListItemRenderer?.navigationEndpoint?.browseEndpoint;
        }

        if (type === 'SEARCH_TYPE_SONG') {
            plays =
                content?.musicResponsiveListItemRenderer?.flexColumns[2]
                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text;
        }

        if (type === 'SEARCH_TYPE_VIDEO') {
            views = infoData[2]?.text;
        }

        if (type === 'SEARCH_TYPE_ARTIST') {
            subscribers = infoData[2]?.text;
        }

        if (type === 'SEARCH_TYPE_ALBUM') {
            artist.push({
                name: infoData[2].text,
                browserEndPoint: infoData[2]?.navigationEndpoint?.browseEndpoint
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
            year
        };
    }

    async searchSuggestions(input: string): Promise<string[]> {
        const res = await fetch(
            `https://music.youtube.com${ApiPaths.searchSuggestions}?prettyPrint=false`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-Goog-Api-Key': XGoogApiKey,
                    Accept: '*/*'
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: 'WEB_REMIX',
                            clientVersion: '1.20240724.00.00',
                            hl: 'en'
                        }
                    },
                    input: input
                })
            }
        );

        console.log(
            'api call: searchSuggestions;',
            'input:',
            input,
            'status:',
            res.status,
            res.statusText
        );

        const jsonData = await res.json();

        const searchSuggestions =
            jsonData?.contents[0]?.searchSuggestionsSectionRenderer?.contents?.map(
                (content) =>
                    content?.searchSuggestionRenderer?.navigationEndpoint?.searchEndpoint?.query
            );

        return searchSuggestions;
    }

    async browse(browseBody: BrowseBody): Promise<ArtistPage | AlbumPage | PlaylistPage | null> {
        const res = await fetch(`https://music.youtube.com${ApiPaths.browse}?prettyPrint=false`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': XGoogApiKey,

                // masking the non-required fields
                'X-Goog-FieldMask': 'contents,header',
                Accept: '*/*'
            },
            body: JSON.stringify({
                context: {
                    client: {
                        clientName: 'WEB_REMIX',
                        clientVersion: '1.20240724.00.00',
                        hl: 'en'
                    }
                },
                browseId: browseBody.browseId
            })
        });

        console.log(
            'api call: browse;',
            'browseId:',
            browseBody.browseId,
            'pageType:',
            browseBody.pageType,
            'status:',
            res.status,
            res.statusText
        );

        const jsonData = await res.json();

        let output: ArtistPage | AlbumPage | PlaylistPage | null = null;

        if (browseBody.pageType === 'ARTIST') {
            output = {
                browseId: browseBody.browseId,
                name: jsonData?.header?.musicImmersiveHeaderRenderer?.title?.runs[0]?.text,
                description:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.description?.runs[0]?.text,
                thumbnail:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.thumbnail
                        ?.musicThumbnailRenderer?.thumbnail?.thumbnails,
                shuffleEndpoint:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.playButton?.buttonRenderer
                        ?.navigationEndpoint?.watchEndpoint,
                radioEndpoint:
                    jsonData?.header?.musicImmersiveHeaderRenderer?.startRadioButton?.buttonRenderer
                        ?.navigationEndpoint?.watchEndpoint,
                songs: jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.musicShelfRenderer?.contents.map(
                    (content) => this.filterAndOrganizeSearchResult(content, 'SEARCH_TYPE_SONG')
                ),
                songsEndpoint:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer
                        ?.content?.sectionListRenderer?.contents[0]?.musicShelfRenderer
                        ?.bottomEndpoint?.browseEndpoint,
                albums: jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[1]?.musicCarouselShelfRenderer?.contents.map(
                    (content) => this.filterAndOrganizeSinglesAndAlbums(content)
                ),
                albumsEndpoint:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer
                        ?.content?.sectionListRenderer?.contents[1]?.musicCarouselShelfRenderer
                        ?.header?.musicCarouselShelfBasicHeaderRenderer?.moreContentButton
                        ?.buttonRenderer?.navigationEndpoint?.browseEndpoint,
                singles:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[2]?.musicCarouselShelfRenderer?.contents.map(
                        (content) => this.filterAndOrganizeSinglesAndAlbums(content)
                    ),
                singlesEndpoint:
                    jsonData?.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer
                        ?.content?.sectionListRenderer?.contents[2]?.musicCarouselShelfRenderer
                        ?.header?.musicCarouselShelfBasicHeaderRenderer?.moreContentButton
                        ?.buttonRenderer?.navigationEndpoint?.browseEndpoint
            };
        } else if (browseBody.pageType === 'ALBUM') {
            const album =
                jsonData?.contents?.twoColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content
                    ?.sectionListRenderer?.contents[0]?.musicResponsiveHeaderRenderer;

            const thumbnail =
                jsonData?.contents?.twoColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content
                    ?.sectionListRenderer?.contents[0]?.musicResponsiveHeaderRenderer?.thumbnail
                    ?.musicThumbnailRenderer?.thumbnail?.thumbnails;

            const artist = [
                {
                    name: album?.straplineTextOne?.runs[0].text,
                    browserEndPoint:
                        album?.straplineTextOne?.runs[0]?.navigationEndpoint?.browseEndpoint
                }
            ];

            output = {
                browseId: browseBody.browseId,
                thumbnail,
                title: album?.title?.runs[0]?.text,
                artist,
                year: album?.subtitle?.runs[2]?.text,
                description:
                    album?.description?.musicDescriptionShelfRenderer?.description?.runs[0]?.text,
                songs: jsonData?.contents?.twoColumnBrowseResultsRenderer?.secondaryContents?.sectionListRenderer?.contents[0]?.musicShelfRenderer?.contents.map(
                    (content): Song => {
                        return {
                            thumbnail,
                            title: content?.musicResponsiveListItemRenderer?.flexColumns[0]
                                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text,
                            watchEndpoint:
                                content?.musicResponsiveListItemRenderer?.flexColumns[0]
                                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
                                    ?.navigationEndpoint?.watchEndpoint,
                            artist,
                            duration:
                                content?.musicResponsiveListItemRenderer?.fixedColumns[0]
                                    ?.musicResponsiveListItemFixedColumnRenderer?.text?.runs[0]
                                    ?.text,
                            plays: content?.musicResponsiveListItemRenderer?.flexColumns[2]
                                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text
                        };
                    }
                ),
                totalDuration: album?.secondSubtitle?.runs[2]?.text
            };
        } else if (browseBody.pageType === 'PLAYLIST') {
            const musicResponsiveHeaderRenderer =
                jsonData?.contents?.twoColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content
                    ?.sectionListRenderer?.contents[0]?.musicResponsiveHeaderRenderer;

            const sectionListRenderer =
                jsonData?.contents?.twoColumnBrowseResultsRenderer?.secondaryContents
                    ?.sectionListRenderer;

            output = {
                browseId: browseBody.browseId,
                thumbnail:
                    musicResponsiveHeaderRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail
                        ?.thumbnails,
                title: musicResponsiveHeaderRenderer?.title?.runs[0]?.text,
                videos: sectionListRenderer?.contents[0]?.musicPlaylistShelfRenderer?.contents.map(
                    (content): Video => {
                        return {
                            thumbnail:
                                content?.musicResponsiveListItemRenderer?.thumbnail
                                    ?.musicThumbnailRenderer?.thumbnail?.thumbnails,
                            title: content?.musicResponsiveListItemRenderer?.flexColumns[0]
                                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text,
                            watchEndpoint:
                                content?.musicResponsiveListItemRenderer?.flexColumns[0]
                                    ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
                                    ?.navigationEndpoint?.watchEndpoint,
                            artist: [
                                {
                                    name: content?.musicResponsiveListItemRenderer?.flexColumns[1]
                                        ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
                                        ?.text,
                                    browserEndPoint:
                                        content?.musicResponsiveListItemRenderer?.flexColumns[1]
                                            ?.musicResponsiveListItemFlexColumnRenderer?.text
                                            ?.runs[0]?.navigationEndpoint?.browseEndpoint
                                }
                            ],
                            duration:
                                content?.musicResponsiveListItemRenderer?.fixedColumns[0]
                                    ?.musicResponsiveListItemFixedColumnRenderer?.text?.runs[0]
                                    ?.text,
                            views: '-1'
                        };
                    }
                ),
                artist: [
                    {
                        name: musicResponsiveHeaderRenderer?.straplineTextOne?.runs[0]?.text,
                        browserEndPoint:
                            musicResponsiveHeaderRenderer?.straplineTextOne?.runs[0]
                                ?.navigationEndpoint?.browseEndpoint
                    }
                ],
                totalTracks: 0,
                totalDuration:
                    musicResponsiveHeaderRenderer?.secondSubtitle?.runs[
                        musicResponsiveHeaderRenderer?.secondSubtitle?.runs?.length - 1
                    ]?.text,
                continuation:
                    sectionListRenderer?.continuations[0]?.nextContinuationData?.continuation
            };

            output.totalTracks = output.videos.length;
        }

        return output;
    }

    private filterAndOrganizeSinglesAndAlbums(content): Single | Album {
        const data = content?.musicTwoRowItemRenderer;
        return {
            thumbnail: data?.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails,
            title: data?.title?.runs[0]?.text,
            year: data?.subtitle?.runs[data?.subtitle?.runs.length - 1]?.text,
            browserEndpoint: data?.navigationEndpoint?.browseEndpoint
        };
    }

    async player(videoId: string): Promise<VideoDetailsFromPlayer> {
        const res = await fetch(`https://music.youtube.com/youtubei/v1/player?prettyPrint=false`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-Goog-Api-Key': XGoogApiKey,
                'X-Goog-FieldMask':
                    'playabilityStatus.status,playerConfig.audioConfig,videoDetails',
                Accept: '*/*'
            },
            body: JSON.stringify({
                context: {
                    client: {
                        hl: 'en',
                        gl: 'IN',
                        clientName: 'WEB_REMIX',
                        clientVersion: '1.20240724.00.00',
                        clientScreen: 'WATCH'
                    },
                    thirdParty: {
                        embedUrl: `https://www.youtube.com//watch?v=${videoId}`
                    }
                },
                videoId: videoId,
                racyCheckOk: true,
                contentCheckOk: true
            })
        });
        const jsonData = await res.json();

        const videoDetails: VideoDetailsFromPlayer = {
            playabilityStatus: jsonData.playabilityStatus,
            videoDetails: {
                videoId: jsonData.videoDetails.videoId,
                title: jsonData.videoDetails.title,
                lengthSeconds: jsonData.videoDetails.lengthSeconds,
                channelId: jsonData.videoDetails.channelId,
                thumbnail: jsonData.videoDetails.thumbnail.thumbnails,
                viewCount: jsonData.videoDetails.viewCount,
                author: jsonData.videoDetails.author
            },
            playerConfig: jsonData.playerConfig
        };

        return videoDetails;
    }

    async audioStreams(videoId: string): Promise<AudioStream[]> {
        let jsonData;

        function sleep(ms: number) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        for (let i = 0; i < MAX_RETRY; i++) {
            const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`, {
                headers: {
                    Accept: '*/*',
                    'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
                    'Content-Type': 'application/json'
                }
            });

            jsonData = await res.json();
            await sleep(200);

            if ('error' in jsonData) {
                continue;
            } else {
                break;
            }
        }

        if ('error' in jsonData) {
            throw new Error(jsonData.error);
        }

        return jsonData.audioStreams;
    }
}

// testing
// const innerTube = new InnerTube();

// innerTube
//     .search({
//         query: 'espresso',
//         type: 'SEARCH_TYPE_ARTIST'
//     })
//     .then((res) => {
//         writeFileSync('./testingData.json', JSON.stringify(res));
//     });
