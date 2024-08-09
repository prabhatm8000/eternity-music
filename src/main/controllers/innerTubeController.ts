import InnerTube from '../innerTube/innerTube.js';
import type { BrowseBody, SearchBody } from '../innerTube/types.js';

const innerTube = new InnerTube();

export const searchHandler = async (event: Electron.IpcMainEvent, body: SearchBody) => {
    try {
        const searchResult = await innerTube.search(body);
        return event.reply('search-reply', searchResult);
    } catch (error) {
        return event.reply('search-reply', 'Something went wrong');
    }
};

export const searchSuggestionHandler = async (event: Electron.IpcMainEvent, query: string) => {
    try {
        const searchSuggestions = await innerTube.searchSuggestions(query);
        return event.reply('search-suggestions-reply', searchSuggestions);
    } catch (error) {
        return event.reply('search-suggestions-reply', 'Something went wrong');
    }
};

export const browseHandler = async (event: Electron.IpcMainEvent, browse: BrowseBody) => {
    const browseResult = await innerTube.browse(browse);
    return event.reply('browse-reply', browseResult);
    // try {
    // } catch (error) {
    //     return event.reply('browse-reply', 'Something went wrong');
    // }
};
