import { writeFileSync } from "fs";
import InnerTube from "./innertube/InnerTube";

const innerTube = new InnerTube();

innerTube
    .search({
        query: "espressso",
        type: "SEARCH_TYPE_SONG",
    })
    .then((data) => {
        writeFileSync("song.json", JSON.stringify(data));
    });
