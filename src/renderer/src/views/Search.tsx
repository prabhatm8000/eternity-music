import AlbumList from '@renderer/components/AlbumList';
import ArtistList from '@renderer/components/ArtistList';
import SearchIcon from '@renderer/components/icons/SearchIcon';
import PlaylistList from '@renderer/components/PlaylistList';
import TrackList from '@renderer/components/TrackList';
import { useSearchDispatch, useSearchSelector } from '@renderer/redux/hooks/search';
import type { SearchSlice } from '@renderer/redux/types';
import type { Album, Artist, SearchResult, SearchType, Song, Video } from '@renderer/types';
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
    }, [searchQuery, tabIndexOnFocus, searchResults]);

    // Fetch More
    useEffect(() => {
        if (fetchMoreResults === undefined) {
            return;
        }

        let key: string;

        switch (fetchMoreResults) {
            case 'SEARCH_TYPE_ALBUM':
                key = 'albums';
            case 'SEARCH_TYPE_ARTIST':
                key = 'artists';
            case 'SEARCH_TYPE_PLAYLIST':
                key = 'playlists';
            case 'SEARCH_TYPE_VIDEO':
                key = 'videos';
            default:
                key = 'songs';
        }

        const handleFetchMore = (key, type: SearchType, continuation: string) => {
            if (!searchResults[key] || searchResults[key]?.continuation === undefined) {
                return;
            }
    
            setIsFetching(true);
            window.innerTube.search({ continuation, type }, (result) => {
                addSearchResultContinuation(key, result);
                setIsFetching(false);
            });
            setFetchMoreResults(undefined);
        };

        handleFetchMore(key, fetchMoreResults, searchResults[key]?.continuation);
    }, [fetchMoreResults]);

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
                <div className="space-y-2">
                    {/* search query */}
                    <div
                        className="ps-10 w-full flex justify-end gap-2 items-center cursor-pointer focus:outline-none"
                        onClick={handleSearchFloatingBtn}
                    >
                        <div className=" py-2 w-[calc(100vw-335px)] bg-inherit text-end text-4xl truncate">
                            {searchQuery}
                        </div>
                        <button onClick={handleSearchFloatingBtn} className="focus:outline-none">
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
                                    className={`cursor-pointer ${tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id !== tabToRender.id ? 'text-black/60 dark:text-white/60 border-transparent' : 'pb-2 border-black dark:border-white'} border-b hover:border-black/30 hover:dark:border-white/30 transition-all duration-100 ease-in-out`}
                                    onClick={() => setTabIndexOnFocus(index)}
                                >
                                    {tabToRender.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* search result tabs */}
            <div
                tabIndex={2}
                onFocus={() => setSearchResultTabsOnFocus(true)}
                onBlur={() => setSearchResultTabsOnFocus(false)}
                className="focus:outline-none"
            >
                <div className="py-3 h-[calc(100vh-120px-80px)]">
                    {tabIndexOnFocus > -1 &&
                        (tabsToRender[tabIndexOnFocus].id === 'SONGS' ||
                            tabsToRender[tabIndexOnFocus].id === 'VIDEOS') && (
                            <TrackList
                                tracks={
                                    tabsToRender[tabIndexOnFocus].id === 'SONGS' &&
                                    searchResults.songs
                                        ? (searchResults.songs.contents as Song[])
                                        : tabsToRender[tabIndexOnFocus].id === 'VIDEOS' &&
                                            searchResults.videos
                                          ? (searchResults.videos.contents as Video[])
                                          : []
                                }
                                isSongs={tabsToRender[tabIndexOnFocus].id === 'SONGS'}
                                handleFetchMore={
                                    tabsToRender[tabIndexOnFocus].id === 'SONGS'
                                        ? () => setFetchMoreResults('SEARCH_TYPE_SONG')
                                        : () => setFetchMoreResults('SEARCH_TYPE_VIDEO')
                                }
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}

                    {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'ARTISTS' && (
                        <ArtistList
                            artists={searchResults.artists?.contents as Artist[]}
                            handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_ARTIST')}
                            isLoading={isLoading}
                            isFetching={isFetching}
                        />
                    )}

                    {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'ALBUMS' && (
                        <AlbumList
                            albums={searchResults.albums?.contents as Album[]}
                            handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_ALBUM')}
                            isLoading={isLoading}
                            isFetching={isFetching}
                        />
                    )}

                    {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'PLAYLISTS' && (
                        <PlaylistList
                            playlists={searchResults.playlists?.contents as Album[]}
                            handleFetchMore={() => setFetchMoreResults('SEARCH_TYPE_PLAYLIST')}
                            isLoading={isLoading}
                            isFetching={isFetching}
                        />
                    )}
                </div>
            </div>

            {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id !== 'MAIN' && (
                <button
                    tabIndex={3}
                    className="fixed z-30 bottom-24 right-6 p-4 rounded-lg bg-stone-600/70 dark:bg-stone-200/70 hover:bg-stone-600/90 dark:hover:bg-stone-200/90 focus:outline-none border-4 border-transparent focus:border-black/30 dark:focus:border-white/30 transition-colors duration-200 ease-in"
                    onClick={handleSearchFloatingBtn}
                >
                    <SearchIcon className="size-6 text-white dark:text-black" />
                </button>
            )}
        </div>
    );
};

export default Search;
