import { configDotenv } from "dotenv";
import fs from "fs";
import InnerTube from "./innertube/InnerTube";

configDotenv();

const innertube = new InnerTube();

// innertube
//     .search({
//         query: "hangover",
//         type: "SEARCH_TYPE_SONG",
//     })
//     .then((data) => {
//         fs.writeFileSync("./testingData/song.json", JSON.stringify(data));
//     });

innertube.browse("MPREb_KfonHvA4DE5", "ALBUM").then((data) => {
    fs.writeFileSync("./testingData/browse.json", JSON.stringify(data));
});
