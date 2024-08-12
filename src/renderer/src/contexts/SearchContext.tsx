import type { SearchResult } from '@renderer/types';
import { createContext, useState } from 'react';

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    tabIndexOnFocus: number;
    setTabIndexOnFocus: React.Dispatch<React.SetStateAction<number>>;
    prevTabIndex: number;
    setPrevTabIndex: React.Dispatch<React.SetStateAction<number>>;

    searchResultSongs: SearchResult | undefined;
    setSearchResultSongs: React.Dispatch<React.SetStateAction<SearchResult | undefined>>;
} | null;

export const SearchContext = createContext<SearchContextType>(null);

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [tabIndexOnFocus, setTabIndexOnFocus] = useState<number>(-1);
    const [prevTabIndex, setPrevTabIndex] = useState<number>(tabIndexOnFocus);

    const [searchResultSongs, setSearchResultSongs] = useState<SearchResult>();

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                tabIndexOnFocus,
                setTabIndexOnFocus,
                prevTabIndex,
                setPrevTabIndex,

                searchResultSongs,
                setSearchResultSongs
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
