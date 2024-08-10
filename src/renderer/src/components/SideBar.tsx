import { useAppContext } from '@renderer/hooks/useAppContext';
import HomeIcon from './icons/HomeIcon';
import SearchIcon from './icons/SearchIcon';
import LibraryIcon from './icons/LibraryIcon';
import SettingsIcon from './icons/SettingsIcon';
import HelpIcon from './icons/HelpIcon';

const SideBar = () => {
    const { setView, view } = useAppContext();

    return (
        <div className="h-screen px-2 py-4 flex flex-col justify-between overflow-auto">
            <div className="space-y-4">
                <h2 className="text-2xl px-3 font-semibold">Eternity Music</h2>
                <nav>
                    <ul className="space-y-1.5">
                        <li
                            onClick={() => setView('HOME')}
                            className={`cursor-pointer flex items-center gap-2 py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-100 ease-in ${view === 'HOME' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            <HomeIcon className="size-5" />
                            Home
                        </li>
                        <li
                            onClick={() => setView('SEARCH')}
                            className={`cursor-pointer flex items-center gap-2 py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-100 ease-in ${view === 'SEARCH' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            <SearchIcon className="size-5" />
                            Search
                        </li>
                        <li
                            onClick={() => setView('LIBRARY')}
                            className={`cursor-pointer flex items-center gap-2 py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-100 ease-in ${view === 'LIBRARY' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            <LibraryIcon className="size-5" />
                            Library
                        </li>
                        <li
                            onClick={() => setView('SETTINGS')}
                            className={`cursor-pointer flex items-center gap-2 py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-100 ease-in ${view === 'SETTINGS' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            <SettingsIcon className="size-5" />
                            Settings
                        </li>
                    </ul>
                </nav>
            </div>

            <div>
                <ul>
                    <li
                        onClick={() => setView('HELP')}
                        className={`cursor-pointer flex items-center gap-2 py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-100 ease-in ${view === 'HELP' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                    >
                        <HelpIcon className="size-5" />
                        Help
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
