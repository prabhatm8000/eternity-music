import { writeFileSync } from "fs";
import InnerTube from "./innertube/InnerTube";

const innerTube = new InnerTube();

innerTube
    .player("ffqliB42Nh4")
    .then((data) => {
        writeFileSync("./testingData/1-data.json", JSON.stringify(data));
    });
