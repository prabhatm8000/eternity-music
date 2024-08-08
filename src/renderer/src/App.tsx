import { useAppContext } from './hooks/useAppContext';
import WithSideBar from './layouts/WithSideBar';
import Help from './views/Help';
import Home from './views/Home';
import Library from './views/Library';
import Search from './views/Search';
import Settings from './views/Settings';

const App = () => {
    const { view } = useAppContext();
    return (
        <div className="bg-transparent text-black dark:text-white w-screen h-screen overflow-hidden">
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
