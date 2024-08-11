import SongList from '@renderer/components/SongList';
import type { Song } from '@renderer/types';
import { useEffect, useState } from 'react';

const SearchSongs = ({ searchQuery }: { searchQuery: string }) => {
    const [SearchResultSongs, setSearchResultSongs] = useState<Song[]>([]);
    const [continuationToken, setContinuationToken] = useState<string | undefined>();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setIsFetching(true);
        window.innerTube.search(
            { query: searchQuery, type: 'SEARCH_TYPE_SONG' },
            (searchResult) => {
                setSearchResultSongs(searchResult.contents as Song[]);
                setContinuationToken(searchResult.continuation);
                setIsFetching(false);
            }
        );
    }, []);

    const handleFetchMore = () => {
        if (!continuationToken) {
            return;
        }

        setIsFetching(true);
        window.innerTube.search(
            { continuation: continuationToken, type: 'SEARCH_TYPE_SONG' },
            (searchResult) => {
                setSearchResultSongs((prevValue) => [
                    ...prevValue,
                    ...(searchResult.contents as Song[])
                ]);
                setContinuationToken(searchResult.continuation);
                setIsFetching(false);
            }
        );
    };

    return (
        <div className="py-3 h-[calc(100vh-120px)]">
            <SongList
                songs={SearchResultSongs}
                handleFetchMore={handleFetchMore}
                isFetching={isFetching}
            />
        </div>
    );
};

export default SearchSongs;
