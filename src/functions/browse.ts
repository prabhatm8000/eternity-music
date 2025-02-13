import constants from "../constants";
import { CallerDataFilterationError } from "../errors/functions";
import fetcher from "../helper/fetcher";
import type {
    AlbumPlaylistPageType,
    ArtistChannelPageType,
    ArtistDiscographyPageType,
    Browse,
    DescriptionSection,
    Item,
    ItemSubTitle,
    PageSection,
} from "../types";
import { musicResponsiveListItemRendererMask, subTitlesCreatorWithFlexColumn } from "./search";

export default async function Browse({
    browse,
}: {
    browse: Browse;
}): Promise<
    ArtistChannelPageType | ArtistDiscographyPageType | AlbumPlaylistPageType
> {
    try {
        const url = `${constants.ApiBaseUrl}${constants.ApiPaths.browse}?prettyPrint=false`;

        const response = await fetcher({
            url,
            method: "POST",
            headers: {
                "X-Goog-FieldMask": `(contents,header)`,
            },
            payload: {
                browseId: browse.browseId,
            },
        });

        let result: any;
        const pageType =
            browse?.browseEndpointContextSupportedConfigs
                ?.browseEndpointContextMusicConfig?.pageType;

        if (
            pageType === "MUSIC_PAGE_TYPE_ARTIST" ||
            pageType === "MUSIC_PAGE_TYPE_USER_CHANNEL"
        ) {
            result = filterArtistChannelPageData(response, browse);
        } else if (pageType === "MUSIC_PAGE_TYPE_ARTIST_DISCOGRAPHY") {
            result = filterArtistDiscographyData(response, browse);
        } else if (
            pageType === "MUSIC_PAGE_TYPE_ALBUM" ||
            pageType === "MUSIC_PAGE_TYPE_PLAYLIST"
        ) {
            result = filterAlbumPlaylistPageData(response, browse);
        } else {
            throw new CallerDataFilterationError(null, "Error while Browsing");
        }

        return result;
    } catch (error) {
        throw new CallerDataFilterationError(error, "Error while Browsing");
    }
}

function musicTwoRowItemRenderer(data: any): Item {
    const thumbnails =
        data?.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails;
    const title = data?.title?.runs?.[0]?.text;
    const watchId = data?.navigationEndpoint?.watchEndpoint?.videoId;
    const browse = data?.navigationEndpoint?.browseEndpoint;
    const subTitles = data?.subtitle?.runs?.map((run: any) => {
        return {
            text: run?.text,
            browse: run?.navigationEndpoint?.browseEndpoint,
        };
    });
    return {
        browse,
        title,
        watchId,
        subTitles,
        thumbnails,
    };
}

function filterArtistChannelPageData(
    data: any,
    browse: Browse
): ArtistChannelPageType {
    const header = data?.header?.musicImmersiveHeaderRenderer;
    const title = header?.title?.runs?.[0]?.text;
    const thumbnails =
        header?.thumbnails?.musicThumbnailRenderer?.thumbnail?.thumbnails;
    const radio =
        header?.startRadioButton?.buttonRenderer?.navigationEndpoint
            ?.watchEndpoint;
    const play =
        header?.playButton?.buttonRenderer?.navigationEndpoint?.watchEndpoint;

    const descriptionSection: DescriptionSection[] = [];
    const sections: PageSection[] = [];
    data?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.forEach(
        (content: any) => {
            if ("musicShelfRenderer" in content) {
                // for songs
                const items = content?.musicShelfRenderer?.contents?.map(musicResponsiveListItemRendererMask);
                sections.push({
                    title: content?.musicShelfRenderer?.title?.runs?.[0]?.text,
                    items,
                    moreBrowseEndpoints:
                        content?.musicShelfRenderer?.bottomEndpoint
                            ?.browseEndpoint,
                });
            } else if ("musicDescriptionShelfRenderer" in content) {
                // for description
                const { header, subheader, description } =
                    content.musicDescriptionShelfRenderer;
                descriptionSection.push({
                    header: header?.runs,
                    subHeader: subheader?.runs,
                    description: description?.runs,
                });
            } else {
                // for all carousel (albums, playlists)
                const renderer = content?.musicCarouselShelfRenderer;
                const { text, navigationEndpoint } =
                    renderer?.header?.musicCarouselShelfBasicHeaderRenderer
                        ?.title?.runs?.[0];
                const section: PageSection = {
                    title: text,
                    moreBrowseEndpoints: navigationEndpoint?.browseEndpoint,
                    items: renderer?.contents?.map((item: any) =>
                        musicTwoRowItemRenderer(item?.musicTwoRowItemRenderer)
                    ),
                };
                sections.push(section);
            }
        }
    );

    return {
        browse,
        thumbnails,
        title,
        radioEndpoint: {
            watchId: radio?.videoId,
            playlistId: radio?.playlistId,
        },
        playEndpoint: {
            watchId: play?.videoId,
            playlistId: play?.playlistId,
        },
        sections,
        descriptionSection: descriptionSection[0],
    };
}

function filterArtistDiscographyData(
    data: any,
    browse: Browse
): ArtistDiscographyPageType {
    const title = data?.header?.musicHeaderRenderer?.title?.runs?.[0]?.text;
    const items =
        data?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.gridRenderer?.items?.map(
            (item: any) =>
                musicTwoRowItemRenderer(item?.musicTwoRowItemRenderer)
        );
    return {
        browse,
        title,
        items,
    };
}

function filterAlbumPlaylistPageData(
    data: any,
    browse: Browse
): AlbumPlaylistPageType {
    const header =
        data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
            ?.content?.sectionListRenderer?.contents?.[0]
            ?.musicResponsiveHeaderRenderer;

    const thumbnails =
        header?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;

    const title = header?.title?.runs?.[0]?.text;

    const subTitles: ItemSubTitle[] = header?.subtitle?.runs;
    subTitles?.push(...(header?.secondSubtitle?.runs || []));

    const descriptionSection: DescriptionSection = {
        header: [],
        subHeader: [],
        description:
            header?.description?.musicDescriptionShelfRenderer?.description
                ?.runs,
    };

    const content =
        data?.contents?.twoColumnBrowseResultsRenderer?.secondaryContents
            ?.sectionListRenderer?.contents?.[0];
    const itemRenderer = content?.musicShelfRenderer
        ? content?.musicShelfRenderer
        : content?.musicPlaylistShelfRenderer;

    const sections: PageSection[] = [
        {
            title: "Songs",
            items: itemRenderer?.contents?.map(musicResponsiveListItemRendererMask),
        },
    ];

    return {
        browse,
        thumbnails,
        title,
        subTitles,
        descriptionSection: descriptionSection?.description
            ? descriptionSection
            : undefined,
        sections,
    };
}
