import { writeFileSync, createWriteStream } from "fs";
import InnerTube from "./innertube/InnerTube";

const innerTube = new InnerTube();

innerTube
    .audioStreams("eleP7yc9dSY")
    .then((data) => {
        writeFileSync("./testingData/1-data.json", JSON.stringify(data));
    });
