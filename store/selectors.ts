import { RootState } from './store';

// Account
export const getIsAuth = (state: RootState) => state.account.isAuth;
export const getLanguage = (state: RootState) => state.account.language;
export const getIsDarkTheme = (state: RootState) => state.account.isDarkTheme;
export const getUserId = (state: RootState) => state.account.currentId;


export const getText = (state: RootState) => state.language.text;
