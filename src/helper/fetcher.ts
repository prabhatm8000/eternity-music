import constants from "../constants";
import { FetcherCallError, FetcherResponseError } from "../errors/fetcher";

export default async function fetcher({
    url,
    method,
    headers,
    payload,
}: {
    url: string;
    method: string;
    headers?: any;
    payload?: any;
}): Promise<any> {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                ...headers,
                "Content-Type": "application/json",
                "X-Goog-Api-Key": constants.XGoogApiKey,
                Accept: "*/*",
            },
            body: JSON.stringify({
                ...payload,
                context: {
                    client: {
                        clientName: "WEB_REMIX",
                        clientVersion: "1.20240724.00.00",
                        hl: "en",
                    },
                },
            }),
        });

        if (!response.ok) {
            throw new FetcherResponseError(response.statusText, "Error from API");
        }

        return await response.json();
    } catch (error) {
        throw new FetcherCallError(error, "Error while fetching");
    }
}
