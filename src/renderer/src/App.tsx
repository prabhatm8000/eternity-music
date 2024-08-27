import WithSideBar from './layouts/WithSideBar';
import { useAppSelector } from './redux/hooks/app';
import type { AppSlice } from './redux/types';
import Help from './views/Help';
import Home from './views/Home';
import Library from './views/Library';
import Search from './views/Search';
import Settings from './views/Settings';

const App = () => {
    const view = useAppSelector((state: { appReducer: AppSlice }) => state.appReducer.view);

    return (
        <div className="bg-transparent text-black dark:text-white w-screen h-screen overflow-hidden select-none">
            <WithSideBar>
                {view === 'HOME' && <Home />}
                {view === 'SEARCH' && <Search />}
                {view === 'LIBRARY' && <Library />}
                {view === 'SETTINGS' && <Settings />}
                {view === 'HELP' && <Help />}
            </WithSideBar>
        </div>
    );
};

export default App;
