import fs from "fs";
import Browse from "./functions/browse";
import Search from "./functions/search";
import type { SearchType } from "./types";
import SearchSuggestions from "./functions/searchSuggestions";
import Player from "./functions/player";

const sleep = async (t: number) => {
    await new Promise((resolve) => setTimeout(resolve, t));
};

async function testSearchSuggestions() {
    console.info("Search Suggestions Testing...");

    const suggestions = await SearchSuggestions("never");

    fs.writeFileSync(
        "testres/search/searchSuggestions.json",
        JSON.stringify(suggestions, null, 2)
    );

    console.info("\nSearch Suggestions Done!\n\n");
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
        await sleep(500);
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
    await sleep(500);

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
    await sleep(500);

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
    await sleep(500);

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
    await sleep(500);

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
    await sleep(500);

    console.log("\nBrowse Testing Done!\n\n");
}

async function testPlayer() {
    const playerData = await Player("4N15045PHEA");
    fs.writeFileSync(
        `testres/player/player.json`,
        JSON.stringify(playerData, null, 2)
    );
    console.log(`Player Testing Done!`);
    await sleep(500);
}

const test = async () => {
    await testSearchSuggestions();
    await testSearch();
    await testBrowse();
};

// test();
testPlayer();
