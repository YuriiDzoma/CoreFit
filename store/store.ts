import { configureStore, combineReducers } from '@reduxjs/toolkit';
import mainSlice from './main-slice';
import accountSlice from './account-slice';
import languageSlice from './language-slice';

const rootReducer = combineReducers({
    main: mainSlice,
    account: accountSlice,
    language: languageSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
