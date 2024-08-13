import SearchIcon from '@renderer/components/icons/SearchIcon';
import TrackList from '@renderer/components/TrackList';
import { useSearchContext } from '@renderer/hooks/useSearchContext';
import type { SearchResult, SearchType, Song, Video } from '@renderer/types';
import { useEffect, useState } from 'react';
import SearchAlbums from './SearchViews/SearchAlbums';
import SearchArtists from './SearchViews/SearchArtists';
import SearchMain from './SearchViews/SearchMain';
import SearchPlaylists from './SearchViews/SearchPlaylists';

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
    const {
        tabIndexOnFocus,
        setTabIndexOnFocus,
        prevTabIndex,
        setPrevTabIndex,
        searchQuery,
        setSearchQuery,

        searchResults,
        setSearchResults
    } = useSearchContext();

    const [searchResultTabsOnFocus, setSearchResultTabsOnFocus] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const handleSearchFloatingBtn = () => {
        setTabIndexOnFocus((prevVal) => {
            setPrevTabIndex(prevVal);
            return -1;
        });
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
                setTabIndexOnFocus((prevIndex) => {
                    setPrevTabIndex(prevIndex);
                    if (prevIndex > 0) {
                        return prevIndex - 1;
                    }
                    return tabsToRender.length - 1;
                });
            } else if (ev.key === 'ArrowRight') {
                setTabIndexOnFocus((prevIndex) => {
                    setPrevTabIndex(prevIndex);
                    if (prevIndex < tabsToRender.length - 1) {
                        return prevIndex + 1;
                    }
                    return 0;
                });
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
        window.innerTube.search({ query: searchQuery, type: type }, (searchResult) => {
            console.log(type, searchResult);

            setSearchResults((prev) => {
                return {
                    ...prev,
                    [key]: searchResult
                };
            });
            setIsLoading(false);
        });
    }, [searchQuery, tabIndexOnFocus]);

    const handleFetchMoreSongs = () => {
        if (!searchResults.songs || searchResults.songs?.continuation === undefined) {
            return;
        }

        setIsFetching(true);
        window.innerTube.search(
            { continuation: searchResults.songs.continuation, type: 'SEARCH_TYPE_SONG' },
            (searchResult) => {
                setSearchResults((prev) => {
                    return {
                        ...prev,
                        songs: {
                            query: prev.songs?.query || 'SEARCH_RESULT_FROM_CONTINUATION',
                            contents: [
                                ...(prev.songs?.contents || []),
                                ...(searchResult.contents || [])
                            ],
                            continuation: searchResult.continuation
                        }
                    };
                });
                setIsFetching(false);
            }
        );
    };

    const handleFetchMoreVideos = () => {
        if (!searchResults.videos || searchResults.videos?.continuation === undefined) {
            return;
        }

        setIsFetching(true);
        window.innerTube.search(
            { continuation: searchResults.videos.continuation, type: 'SEARCH_TYPE_VIDEO' },
            (searchResult) => {
                setSearchResults((prev) => {
                    return {
                        ...prev,
                        videos: {
                            query: prev.videos?.query || 'SEARCH_RESULT_FROM_CONTINUATION',
                            contents: [
                                ...(prev.videos?.contents || []),
                                ...(searchResult.contents || [])
                            ],
                            continuation: searchResult.continuation
                        }
                    };
                });
                setIsFetching(false);
            }
        );
    };

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
                                        ? handleFetchMoreSongs
                                        : handleFetchMoreVideos
                                }
                                isLoading={isLoading}
                                isFetching={isFetching}
                            />
                        )}
                </div>
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'ARTISTS' && (
                    <SearchArtists />
                )}
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'ALBUMS' && (
                    <SearchAlbums />
                )}
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'PLAYLISTS' && (
                    <SearchPlaylists />
                )}
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
