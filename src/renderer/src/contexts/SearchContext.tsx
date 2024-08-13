import type { SearchResult } from '@renderer/types';
import { createContext, useState } from 'react';

type SearchViewResulsForAllType = {
    songs: SearchResult | undefined;
    videos: SearchResult | undefined;
    artists: SearchResult | undefined;
    albums: SearchResult | undefined;
    playlists: SearchResult | undefined;
};

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    tabIndexOnFocus: number;
    setTabIndexOnFocus: React.Dispatch<React.SetStateAction<number>>;
    prevTabIndex: number;
    setPrevTabIndex: React.Dispatch<React.SetStateAction<number>>;

    searchResults: SearchViewResulsForAllType;
    setSearchResults: React.Dispatch<React.SetStateAction<SearchViewResulsForAllType>>;
} | null;

export const SearchContext = createContext<SearchContextType>(null);

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [tabIndexOnFocus, setTabIndexOnFocus] = useState<number>(-1);
    const [prevTabIndex, setPrevTabIndex] = useState<number>(tabIndexOnFocus);

    const [searchResults, setSearchResults] = useState<SearchViewResulsForAllType>({
        albums: undefined,
        artists: undefined,
        playlists: undefined,
        songs: undefined,
        videos: undefined
    });

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                tabIndexOnFocus,
                setTabIndexOnFocus,
                prevTabIndex,
                setPrevTabIndex,

                searchResults,
                setSearchResults
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
