import ytdl from "ytdl-core";
import constants from "../constants";
import fetcher from "../helper/fetcher";

export default async function Player(watchId: string) {
    const url = `${constants.ApiBaseUrl}${constants.ApiPaths.player}?prettyPrint=false`;

    const response = await fetcher({
        url,
        method: "POST",
        payload: {
            context: {
                client: {
                    clientName: "WEB_REMIX",
                    clientVersion: "1.20240724.00.00",
                    hl: "en",
                },
            },
            videoId: watchId,
            racyCheckOk: true,
            contentCheckOk: true,
        },
    });

    const t = await ytdl.getInfo(`https://www.youtube.com/watch?v=${watchId}`);
    console.log(t);
    

    return response;
}