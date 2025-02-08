import Search from "./callers/search";
import fs from "fs";
import type { SearchType } from "./types";

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

testSearch();
