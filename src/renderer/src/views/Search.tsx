import { useEffect, useState } from 'react';
import SearchMain from './SearchViews/SearchMain';
import SearchSongs from './SearchViews/SearchSongs';
import SearchIcon from '@renderer/components/icons/SearchIcon';

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
    const [tab, setTab] = useState<TabType>('MAIN');
    const [prevTab, setPrevTab] = useState<TabType>(tab);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearchFloatingBtn = () => {
        setTab((prevVal) => {
            setPrevTab(prevVal);
            return 'MAIN';
        });
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            setTab(prevTab === "MAIN" ? "SONGS" : prevTab);
        }
    }, [searchQuery]);

    return (
        <div className="px-4">
            {tab === 'MAIN' && (
                <SearchMain
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleBackBtn={() => setTab(prevTab)}
                />
            )}

            {tab !== 'MAIN' && (
                <div className="space-y-2">
                    {/* search query */}
                    <div
                        className="flex justify-end gap-2 items-center cursor-pointer"
                        onClick={handleSearchFloatingBtn}
                    >
                        <div className="w-full py-2 ms-10 bg-inherit text-end text-4xl">
                            {searchQuery}
                        </div>
                        <SearchIcon className="size-9 text-black/60 dark:text-white/60 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                    </div>

                    {/* tabs */}
                    <div>
                        <ul className="flex gap-4 border-b border-white/10">
                            {tabsToRender.map((tabToRender, index) => (
                                <li
                                    key={index + tabToRender.id}
                                    className={`cursor-pointer ${tab !== tabToRender.id ? 'text-black/60 dark:text-white/60' : 'pb-2 border-black dark:border-white'} border-b border-transparent hover:border-black/30 hover:dark:border-white/30 transition-all duration-100 ease-in-out`}
                                    onClick={() => setTab(tabToRender.id)}
                                >
                                    {tabToRender.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {tab === 'SONGS' && <SearchSongs searchQuery={searchQuery} />}

            {tab !== 'MAIN' && (
                <button
                    className="fixed z-30 bottom-10 right-10 p-4 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition-colors duration-200 ease-in focus:outline-none"
                    onClick={handleSearchFloatingBtn}
                >
                    <SearchIcon className="size-6 text-black dark:text-white" />
                </button>
            )}
        </div>
    );
};

export default Search;
