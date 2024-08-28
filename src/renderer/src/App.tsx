import WithSideBar from './layouts/WithSideBar';
import { useAppSelector } from './redux/hooks/app';
import type { AppSlice } from './redux/types';
import Browse from './views/Browse';
import Help from './views/Help';
import Home from './views/Home';
import Library from './views/Library';
import Search from './views/Search';
import Settings from './views/Settings';

const App = () => {
    const view = useAppSelector((state: { appReducer: AppSlice }) => state.appReducer.view);
    const browse = useAppSelector((state: { appReducer: AppSlice }) => state.appReducer.browse);

    return (
        <div className="bg-transparent text-black dark:text-white w-screen h-screen overflow-hidden select-none">
            <WithSideBar>
                {!browse && (
                    <>
                        {view === 'HOME' && <Home />}
                        {view === 'SEARCH' && <Search />}
                        {view === 'LIBRARY' && <Library />}
                        {view === 'SETTINGS' && <Settings />}
                        {view === 'HELP' && <Help />}
                    </>
                )}

                {browse && <Browse browseId={browse.browseId} pageType={browse.pageType} />}
            </WithSideBar>
        </div>
    );
};

export default App;
