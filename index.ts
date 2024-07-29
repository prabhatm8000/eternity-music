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

innertube.browse("UCwgX_dLqGYna_7Fm8ecf4Ng", "ARTIST").then((data) => {
    fs.writeFileSync("./testingData/browse.json", JSON.stringify(data));
});
