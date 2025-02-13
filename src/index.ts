import fs from "fs";
import Browse from "./functions/browse";
import Search from "./functions/search";
import type { SearchType } from "./types";
import SearchSuggestions from "./functions/searchSuggestions";

async function testSearchSuggestions() {
    console.info("Search Suggestions Testing...");

    const suggestions = await SearchSuggestions("never");

    fs.writeFileSync(
        "testres/searchSuggestions.json",
        JSON.stringify(suggestions, null, 2)
    );

    console.info("Search Suggestions Done!");
}

async function testSearch(type?: SearchType) {
    console.log("Search Testing...\n");

    const searchTypes = type
        ? [type]
        : ["SONGS", "VIDEOS", "ARTISTS", "ALBUMS", "PLAYLISTS"];

    for (const type of searchTypes) {
        const searchResults = await Search({
            searchType: type as SearchType,
            query: "k pop",
        });
        fs.writeFileSync(
            `testres/search/${type.toLowerCase()}.json`,
            JSON.stringify(searchResults, null, 2)
        );
        if (searchResults.continuation) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const continuationResults = await Search({
                searchType: type as SearchType,
                continuation: searchResults.continuation,
            });
            fs.writeFileSync(
                `testres/search/${type.toLowerCase()}_continuation.json`,
                JSON.stringify(continuationResults, null, 2)
            );
        }
        console.log(`Search ${type} Done!`);
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log("\nSearch Testing Done!\n\n");
}

async function testBrowse() {
    console.log("Browse Testing...\n");

    // Artist
    const browseData = await Browse({
        browse: {
            browseId: "UCkbbMCA40i18i7UdjayMPAg",
            browseEndpointContextSupportedConfigs: {
                browseEndpointContextMusicConfig: {
                    pageType: "MUSIC_PAGE_TYPE_ARTIST",
                },
            },
        },
    });
    fs.writeFileSync(
        `testres/browse/artist.json`,
        JSON.stringify(browseData, null, 2)
    );
    console.log(`Browse Artist Done!`);

    // discography
    const discographyBrowseData = await Browse({
        browse: {
            browseId: "MPADUCkbbMCA40i18i7UdjayMPAg",
            browseEndpointContextSupportedConfigs: {
                browseEndpointContextMusicConfig: {
                    pageType: "MUSIC_PAGE_TYPE_ARTIST_DISCOGRAPHY",
                },
            },
        },
    });
    fs.writeFileSync(
        `testres/browse/discography.json`,
        JSON.stringify(discographyBrowseData, null, 2)
    );
    console.log(`Browse Discography Done!`);

    // Album
    const albumBrowseData = await Browse({
        browse: {
            browseId: "MPREb_ODbk3DwVCqR",
            browseEndpointContextSupportedConfigs: {
                browseEndpointContextMusicConfig: {
                    pageType: "MUSIC_PAGE_TYPE_ALBUM",
                },
            },
        },
    });
    fs.writeFileSync(
        `testres/browse/album.json`,
        JSON.stringify(albumBrowseData, null, 2)
    );
    console.log(`Browse Album Done!`);

    // Playlist
    const playlistBrowseData = await Browse({
        browse: {
            browseId: "VLOLAK5uy_nsoD3Zf0AuDIGT89P_3UYvVS7-2rJRE0k",
            browseEndpointContextSupportedConfigs: {
                browseEndpointContextMusicConfig: {
                    pageType: "MUSIC_PAGE_TYPE_PLAYLIST",
                },
            },
        },
    });
    fs.writeFileSync(
        `testres/browse/playlist.json`,
        JSON.stringify(playlistBrowseData, null, 2)
    );
    console.log(`Browse Playlist Done!`);

    // Channel
    const channelBrowseData = await Browse({
        browse: {
            browseId: "UCeX4PfcRed2ENjHqGQb6ffg",
            browseEndpointContextSupportedConfigs: {
                browseEndpointContextMusicConfig: {
                    pageType: "MUSIC_PAGE_TYPE_USER_CHANNEL",
                },
            },
        },
    });
    fs.writeFileSync(
        `testres/browse/channel.json`,
        JSON.stringify(channelBrowseData, null, 2)
    );
    console.log(`Browse Channel Done!`);

    console.log("\nBrowse Testing Done!\n\n");
}

const test = () => {
    testSearchSuggestions();
    testSearch();
    testBrowse();
};

test();
