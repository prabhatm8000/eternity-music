import AlbumList from '@renderer/components/AlbumList';
import ArtistList from '@renderer/components/ArtistList';
import BackIcon from '@renderer/components/icons/BackIcon';
import SearchIcon from '@renderer/components/icons/SearchIcon';
import PlaylistList from '@renderer/components/PlaylistList';
import TrackList from '@renderer/components/TrackList';
import { scrollToTopInElement } from '@renderer/helper/scrolls';
import { useSearchDispatch, useSearchSelector } from '@renderer/redux/hooks/search';
import type { SearchSlice } from '@renderer/redux/types';
import type {
    Album,
    Artist,
    Playlist,
    SearchResult,
    SearchType,
    Song,
    Video
} from '@renderer/types';
import { useEffect, useState } from 'react';
import SearchMain from './SearchViews/SearchMain';

type TabType = 'MAIN' | 'SONGS' | 'VIDEOS' | 'ARTISTS' | 'ALBUMS' | 'PLAYLISTS';
const tabsToRender: { id: TabType; label: string }[] = [
    {
        id: 'SONGS',
        label: 'Songs'
    },
    {
        id: 'VIDEOS',
        label: 'Videos'
    },
    {
        id: 'ARTISTS',
        label: 'Artists'
    },
    {
        id: 'ALBUMS',
        label: 'Albums'
    },
    {
        id: 'PLAYLISTS',
        label: 'Playlists'
    }
];

const Search = () => {
    const { prevTabIndex, searchQuery, searchResults, tabIndexOnFocus } = useSearchSelector(
        (state) => state.searchReducer
    );

    // #region search hooks
    const searchDispatch = useSearchDispatch();

    const setPrevTabIndex = (index: SearchSlice['prevTabIndex']) => {
        searchDispatch({ type: 'search/setPrevTabIndex', payload: index });
    };

    const setSearchQuery = (query: SearchSlice['searchQuery']) => {
        searchDispatch({ type: 'search/setSearchQuery', payload: query });
    };

    const setSearchResult = (key, result: SearchResult) => {
        searchDispatch({ type: 'search/setSearchResult', payload: { key, result } });
    };

    const setTabIndexOnFocus = (index: SearchSlice['tabIndexOnFocus']) => {
        searchDispatch({ type: 'search/setTabIndexOnFocus', payload: index });
    };

    const addSearchResultContinuation = (key, result: SearchResult) => {
        searchDispatch({ type: 'search/addSearchResultContinuation', payload: { key, result } });
    };
    // #endregion

    const [searchResultTabsOnFocus, setSearchResultTabsOnFocus] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchMoreResults, setFetchMoreResults] = useState<SearchType | undefined>(undefined);

    const handleSearchFloatingBtn = () => {
        setPrevTabIndex(tabIndexOnFocus);
        setTabIndexOnFocus(-1);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length > 0) {
            setTabIndexOnFocus(prevTabIndex === -1 ? 0 : prevTabIndex);
        }
    };

    const handleScrollToTop = () => {
        const element = document
            .getElementById('search-result-container')
            ?.getElementsByTagName('div')[0];
        scrollToTopInElement(element);
    };

    // Arrow key listeners
    useEffect(() => {
        const handleUpDownKeys = (ev: KeyboardEvent) => {
            if (ev.key === 'ArrowLeft') {
                setPrevTabIndex(tabIndexOnFocus);
                setTabIndexOnFocus(
                    tabIndexOnFocus > 0 ? tabIndexOnFocus - 1 : tabsToRender.length - 1
                );
            } else if (ev.key === 'ArrowRight') {
                setTabIndexOnFocus(
                    tabIndexOnFocus < tabsToRender.length - 1 ? tabIndexOnFocus + 1 : 0
                );
            }
        };

        if (!searchResultTabsOnFocus) {
            return;
        }

        document.addEventListener('keydown', handleUpDownKeys);

        return () => {
            document.removeEventListener('keydown', handleUpDownKeys);
        };
    });

    // Search Results
    useEffect(() => {
        let resultObj: SearchResult | undefined;
        let type: SearchType | undefined;
        let key: string;

        switch (tabIndexOnFocus) {
            case 0:
                resultObj = searchResults.songs;
                type = 'SEARCH_TYPE_SONG';
                key = 'songs';
                break;
            case 1:
                resultObj = searchResults.videos;
                type = 'SEARCH_TYPE_VIDEO';
                key = 'videos';
                break;
            case 2:
                resultObj = searchResults.artists;
                type = 'SEARCH_TYPE_ARTIST';
                key = 'artists';
                break;
            case 3:
                resultObj = searchResults.albums;
                type = 'SEARCH_TYPE_ALBUM';
                key = 'albums';
                break;
            case 4:
                resultObj = searchResults.playlists;
                type = 'SEARCH_TYPE_PLAYLIST';
                key = 'playlists';
                break;
            default:
                break;
        }

        if (
            tabIndexOnFocus === -1 ||
            searchQuery === '' ||
            searchQuery === resultObj?.query ||
            type === undefined
        ) {
            return;
        }

        setIsLoading(true);
        window.innerTube.search({ query: searchQuery, type: type }, (result) => {
            console.log(type, result);

            setSearchResult(key, result);
            setIsLoading(false);
        });
    }, [
        searchQuery,
        tabIndexOnFocus,
        searchResults.albums?.query,
        searchResults.artists?.query,
        searchResults.playlists?.query,
        searchResults.songs?.query,
        searchResults.videos?.query
    ]);

    // Fetch More
    useEffect(() => {
        if (fetchMoreResults === undefined) {
            return;
        }

        const handleFetchMore = (fetchMoreResults: SearchType) => {
            let key: string =
                fetchMoreResults === 'SEARCH_TYPE_ALBUM'
                    ? 'albums'
                    : fetchMoreResults === 'SEARCH_TYPE_ARTIST'
                      ? 'artists'
                      : fetchMoreResults === 'SEARCH_TYPE_PLAYLIST'
                        ? 'playlists'
                        : fetchMoreResults === 'SEARCH_TYPE_VIDEO'
                          ? 'videos'
                          : 'songs';

            if (!searchResults[key] || searchResults[key]?.continuation === undefined) {
                return;
            }
            console.log(fetchMoreResults, key);

            setIsFetching(true);
            window.innerTube.search(
                { continuation: searchResults[key]?.continuation, type: fetchMoreResults },
                (result) => {
                    addSearchResultContinuation(key, result);
                    setIsFetching(false);
                }
            );
            setFetchMoreResults(undefined);
        };

        handleFetchMore(fetchMoreResults);
    }, [fetchMoreResults, searchResults]);

    return (
        <div className="px-2">
            {tabIndexOnFocus === -1 && (
                <SearchMain
                    searchQuery={searchQuery}
                    handleSearch={handleSearch}
                    handleBackBtn={() => setTabIndexOnFocus(prevTabIndex)}
                />
            )}

            {tabIndexOnFocus !== -1 && (
                <>
                    <div className="space-y-2">
                        {/* search query */}
                        <div
                            className="ps-10 w-full flex justify-end gap-2 items-center cursor-pointer focus:outline-none"
                            onClick={handleSearchFloatingBtn}
                        >
                            <div className=" py-2 w-[calc(100vw-335px)] bg-inherit text-end text-4xl truncate">
                                {searchQuery}
                            </div>
                            <button
                                onClick={handleSearchFloatingBtn}
                                className="focus:outline-none"
                            >
                                <SearchIcon className="size-8 text-black/60 dark:text-white/60 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                            </button>
                        </div>

                        {/* tabs */}
                        <div
                            tabIndex={2}
                            onFocus={() => setSearchResultTabsOnFocus(true)}
                            onBlur={() => setSearchResultTabsOnFocus(false)}
                            className="focus:outline-none"
                        >
                            <ul
                                className={`flex gap-4 border-b ${searchResultTabsOnFocus ? 'border-black/30 dark:border-white/30' : 'border-black/10 dark:border-white/10'}`}
                            >
                                {tabsToRender.map((tabToRender, index) => (
                                    <li
                                        key={index + tabToRender.id}
                                        className={`cursor-pointer ${tabsToRender[tabIndexOnFocus].id !== tabToRender.id ? 'text-black/60 dark:text-white/60 border-transparent' : 'pb-2 border-black dark:border-white'} border-b hover:border-black/30 hover:dark:border-white/30 transition-all duration-100 ease-in-out`}
                                        onClick={() => setTabIndexOnFocus(index)}
                                    >
                                        {tabToRender.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* search result tabs */}
                    <div
                        tabIndex={2}
                        onFocus={() => setSearchResultTabsOnFocus(true)}
                        onBlur={() => setSearchResultTabsOnFocus(false)}
                        id="search-result-container"
                        className={`focus:outline-none py-3 h-[calc(100vh-120px-80px)] overflow-x-scroll`}
                    >
                        {tabsToRender[tabIndexOnFocus].id === 'SONGS' && (
                            <TrackList
                                tracks={(searchResults.songs?.contents as Song[]) || []}
                                isSongs={true}
                                handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_SONG')}
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}

                        {tabsToRender[tabIndexOnFocus].id === 'VIDEOS' && (
                            <TrackList
                                tracks={(searchResults.videos?.contents as Video[]) || []}
                                isSongs={false}
                                handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_VIDEO')}
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}

                        {tabsToRender[tabIndexOnFocus].id === 'ARTISTS' && (
                            <ArtistList
                                artists={(searchResults.artists?.contents as Artist[]) || []}
                                handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_ARTIST')}
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}

                        {tabsToRender[tabIndexOnFocus].id === 'ALBUMS' && (
                            <AlbumList
                                albums={(searchResults.albums?.contents as Album[]) || []}
                                handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_ALBUM')}
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}

                        {tabsToRender[tabIndexOnFocus].id === 'PLAYLISTS' && (
                            <PlaylistList
                                playlists={(searchResults.playlists?.contents as Playlist[]) || []}
                                handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_PLAYLIST')}
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}
                    </div>

                    {/* search floating btn */}
                    {tabsToRender[tabIndexOnFocus].id !== 'MAIN' && (
                        <div className="flex gap-4 items-center fixed z-30 bottom-24 right-6">
                            <button
                                tabIndex={3}
                                className="p-3 rounded-lg bg-stone-600/70 dark:bg-stone-200/70 hover:bg-stone-600/90 dark:hover:bg-stone-200/90 focus:outline-none border-4 border-transparent focus:border-black/30 dark:focus:border-white/30 transition-colors duration-200 ease-in"
                                onClick={handleScrollToTop}
                            >
                                <BackIcon className="size-5 text-white dark:text-black rotate-90" />
                            </button>
                            <button
                                tabIndex={4}
                                className="p-3 rounded-lg bg-stone-600/70 dark:bg-stone-200/70 hover:bg-stone-600/90 dark:hover:bg-stone-200/90 focus:outline-none border-4 border-transparent focus:border-black/30 dark:focus:border-white/30 transition-colors duration-200 ease-in"
                                onClick={handleSearchFloatingBtn}
                            >
                                <SearchIcon className="size-5 text-white dark:text-black" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;
