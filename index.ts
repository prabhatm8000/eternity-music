import { configDotenv } from "dotenv";
import fs from "fs";
import InnerTube from "./innertube/InnerTube";

configDotenv();

const innertube = new InnerTube();

// innertube
//     .search({
//         query: "phonk",
//         type: "SEARCH_TYPE_PLAYLIST",
//     })
//     .then((data) => {
//         fs.writeFileSync("./testingData/playlist.json", JSON.stringify(data));
//     });

innertube.browse("VLPLZumdd7y9eygbF0kE1K81Wo0E7O0fj2bp", "PLAYLIST").then((data) => {
    fs.writeFileSync("./testingData/browse.json", JSON.stringify(data));
});
