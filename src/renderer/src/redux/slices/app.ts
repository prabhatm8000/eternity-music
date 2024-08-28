import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppSlice } from '../types';
import type { ViewType } from '@renderer/types';

const initialState: AppSlice = {
    view: 'HOME',
    browse: null,
    appLoading: false
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<ViewType>) => {
            state.view = action.payload;
        },

        setBrowse: (
            state,
            action: PayloadAction<{
                browseId: string;
                pageType: 'BROWSER_ALBUM' | 'BROWSER_ARTIST' | 'BROWSER_PLAYLIST';
            } | null>
        ) => {
            state.browse = action.payload;
        },

        setAppLoading: (state, action: PayloadAction<boolean>) => {
            state.appLoading = action.payload;
        }
    }
});

export const { setView } = appSlice.actions;
export default appSlice.reducer;
