import constants from "../constants";
import { CallerDataFilterationError } from "../errors/functions";
import fetcher from "../helper/fetcher";

export default async function SearchSuggestions(query: string): Promise<string[]> {
    try {
        const url = `${constants.ApiBaseUrl}${constants.ApiPaths.searchSuggestions}?prettyPrint=false`;

        const response = await fetcher({
            url,
            method: "POST",
            payload: {
                input: query,
            },
        });

        return response as string[];
    } catch (error) {
        throw new CallerDataFilterationError(error, "Error while getting search suggestions");
    }
}
