import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchSlice } from '../types';
import type { SearchResult, SearchType } from '@renderer/types';

const initialState: SearchSlice = {
    searchQuery: '',
    tabIndexOnFocus: -1,
    prevTabIndex: -1,
    searchResults: {
        albums: undefined,
        artists: undefined,
        playlists: undefined,
        songs: undefined,
        videos: undefined
    }
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        setTabIndexOnFocus: (state, action: PayloadAction<number>) => {
            state.tabIndexOnFocus = action.payload;
        },

        setPrevTabIndex: (state, action: PayloadAction<number>) => {
            state.prevTabIndex = action.payload;
        },

        setSearchResult: (
            state,
            action: PayloadAction<{
                key: 'albums' | 'artists' | 'playlists' | 'songs' | 'videos';
                result: SearchResult;
            }>
        ) => {
            state.searchResults[action.payload.key] = action.payload.result;
        },

        addSearchResultContinuation: (
            state,
            action: PayloadAction<{
                key: 'albums' | 'artists' | 'playlists' | 'songs' | 'videos';
                result: SearchResult;
            }>
        ) => {
            if (state.searchResults[action.payload.key] === undefined) {
                state.searchResults[action.payload.key] = action.payload.result;
            } else {
                state.searchResults[action.payload.key]!.query =
                    action.payload.result.query || 'SEARCH_RESULT_FROM_CONTINUATION';

                state.searchResults[action.payload.key]!.contents.push(
                    ...(action.payload.result.contents || [])
                );
                state.searchResults[action.payload.key]!.continuation =
                    action.payload.result.continuation;
            }
        }
    }
});

export const { setPrevTabIndex, setSearchQuery, setSearchResult, setTabIndexOnFocus } =
    searchSlice.actions;
export default searchSlice.reducer;
