import { useAppContext } from '@renderer/hooks/useAppContext';

const SideBar = () => {
    const { setView, view } = useAppContext();

    return (
        <div className="h-screen px-2 py-4 flex flex-col justify-between overflow-auto">
            <div className="space-y-4">
                <h2 className="text-2xl px-3 font-semibold">Eternity Music</h2>
                <nav>
                    <ul className="space-y-1">
                        <li
                            onClick={() => setView('HOME')}
                            className={`py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${view === 'HOME' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            
                            Home
                        </li>
                        <li
                            onClick={() => setView('SEARCH')}
                            className={`py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${view === 'SEARCH' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            Search
                        </li>
                        <li
                            onClick={() => setView('LIBRARY')}
                            className={`py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${view === 'LIBRARY' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            Library
                        </li>
                        <li
                            onClick={() => setView('SETTINGS')}
                            className={`py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${view === 'SETTINGS' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                        >
                            Settings
                        </li>
                    </ul>
                </nav>
            </div>

            <div>
                <ul>
                    <li
                        onClick={() => setView('HELP')}
                        className={`py-1 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${view === 'HELP' ? 'bg-black/5 dark:bg-white/5' : ''}`}
                    >
                        Help
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
