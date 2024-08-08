import { AppContext } from '@renderer/contexts/AppContext';
import { useContext } from 'react';

export const useAppContext = () => {
    const appContext = useContext(AppContext);
    if (!appContext) throw new Error('AppContext is not provided');
    return appContext;
};
