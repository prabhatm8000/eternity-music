import { useEffect } from 'react';

const Search = () => {
    useEffect(() => {
        window.innerTube.search({ query: 'Cradles', type: 'SEARCH_TYPE_SONG' }, (result) => {
            console.log(result);
        });
        window.innerTube.searchSuggestions('hangover', (result) => {
            console.log(result);
        });
        window.innerTube.browse(
            { browseId: 'VLPL8zpGXaXwt-uuV1HMEvkQvZ9U9_v1ZhlU', pageType: 'PLAYLIST' },
            (result) => {
                console.log(result);
            }
        );
    }, []);
    return <div>Search</div>;
};

export default Search;
