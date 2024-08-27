import './assets/main.css';

import ReactDOM from 'react-dom/client';
import App from './App';
import { SearchContextProvider } from './contexts/SearchContext';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <SearchContextProvider>
            <App />
        </SearchContextProvider>
    </Provider>
);
