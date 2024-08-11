import { useEffect, useState } from 'react';
import SearchMain from './SearchViews/SearchMain';
import SearchSongs from './SearchViews/SearchSongs';
import SearchIcon from '@renderer/components/icons/SearchIcon';
import SearchVideos from './SearchViews/SearchVideos';
import SearchArtists from './SearchViews/SearchArtists';
import SearchAlbums from './SearchViews/SearchAlbums';
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
    const [tabIndexOnFocus, setTabIndexOnFocus] = useState<number>(-1);
    const [prevTabIndex, setPrevTabIndex] = useState<number>(tabIndexOnFocus);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [searchResultTabsOnFocus, setSearchResultTabsOnFocus] = useState<boolean>(false);

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
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'SONGS' && (
                    <SearchSongs searchQuery={searchQuery} />
                )}
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'VIDEOS' && (
                    <SearchVideos searchQuery={searchQuery} />
                )}
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'ARTISTS' && (
                    <SearchArtists searchQuery={searchQuery} />
                )}
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'ALBUMS' && (
                    <SearchAlbums searchQuery={searchQuery} />
                )}
                {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id === 'PLAYLISTS' && (
                    <SearchPlaylists searchQuery={searchQuery} />
                )}
            </div>

            {tabIndexOnFocus > -1 && tabsToRender[tabIndexOnFocus].id !== 'MAIN' && (
                <button
                    tabIndex={3}
                    className="fixed z-30 bottom-10 right-10 p-4 rounded-lg bg-stone-600/70 dark:bg-stone-200/70 hover:bg-stone-600/90 dark:hover:bg-stone-200/90 focus:outline-none border-4 border-transparent focus:border-black/30 dark:focus:border-white/30 transition-colors duration-200 ease-in"
                    onClick={handleSearchFloatingBtn}
                >
                    <SearchIcon className="size-6 text-white dark:text-black" />
                </button>
            )}
        </div>
    );
};

export default Search;
