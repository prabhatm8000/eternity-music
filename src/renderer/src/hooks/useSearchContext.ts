import { SearchContext } from '@renderer/contexts/SearchContext';
import { useContext } from 'react';

export const useSearchContext = () => {
    const searchContext = useContext(SearchContext);
    if (!searchContext) throw new Error('SearchContext is not provided');
    return searchContext;
};
