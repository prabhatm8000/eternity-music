import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppSlice } from '../types';
import type { ViewType } from '@renderer/types';

const initialState: AppSlice = {
    view: 'HOME',
    appLoading: false
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<ViewType>) => {
            state.view = action.payload;
        },
        
        setAppLoading: (state, action: PayloadAction<boolean>) => {
            state.appLoading = action.payload;
        }
    }
});

export const { setView } = appSlice.actions;
export default appSlice.reducer;
