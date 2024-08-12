import SongList from '@renderer/components/SongList';
import { useSearchContext } from '@renderer/hooks/useSearchContext';
import type { Song } from '@renderer/types';
import { useEffect, useState } from 'react';

const SearchSongs = () => {
    const { searchQuery } = useSearchContext();
    const {searchResultSongs, setSearchResultSongs} = useSearchContext();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (searchQuery === searchResultSongs?.query) {
            return;
        }

        setIsFetching(true);
        console.log('searchQuery', searchQuery);
        window.innerTube.search(
            { query: searchQuery, type: 'SEARCH_TYPE_SONG' },
            (searchResult) => {
                setSearchResultSongs(searchResult);
                setIsFetching(false);
            }
        );
    }, [searchResultSongs]);

    const handleFetchMore = () => {
        if (!searchResultSongs || searchResultSongs?.continuation === undefined) {
            return;
        }

        setIsFetching(true);
        window.innerTube.search(
            { continuation: searchResultSongs.continuation, type: 'SEARCH_TYPE_SONG' },
            (searchResult) => {
                setSearchResultSongs((prevValue) => {
                    return {
                        query: prevValue?.query || 'SEARCH_RESULT_FROM_CONTINUATION',
                        contents: [...(prevValue?.contents || []), ...(searchResult.contents || [])],
                        continuation: searchResult.continuation,
                    };
                });
                setIsFetching(false);
            }
        );
    };

    return (
        <div className="py-3 h-[calc(100vh-120px)]">
            <SongList
                songs={searchResultSongs ? searchResultSongs.contents as Song[] : []}
                handleFetchMore={handleFetchMore}
                isFetching={isFetching}
            />
        </div>
    );
};

export default SearchSongs;
