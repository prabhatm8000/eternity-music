import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import searchReducer from './slices/search';

export const store = configureStore({
    reducer: {
        appReducer,
        searchReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
