import type { ViewType } from '@renderer/types';
import { createContext, useState } from 'react';

type AppContextType = {
    view: ViewType;
    setView: (viewType: ViewType) => void;
} | null;

export const AppContext = createContext<AppContextType>(null);

export const AppContextProvider = ({ children }) => {
    const [view, setView] = useState<ViewType>('HOME');

    return (
        <AppContext.Provider
            value={{
                view,
                setView
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
