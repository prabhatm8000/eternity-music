import BackIcon from '@renderer/components/icons/BackIcon';
import SearchIcon from '@renderer/components/icons/SearchIcon';
import { useEffect, useState } from 'react';

const SearchMain = ({
    searchQuery,
    setSearchQuery,
    handleBackBtn
}: {
    searchQuery: string;
    setSearchQuery: (value: React.SetStateAction<string>) => void;
    handleBackBtn: () => void;
}) => {
    const [searchQueryInput, setSearchQueryInput] = useState<string>(searchQuery);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchQuery(searchQueryInput.trim());
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQueryInput(suggestion);
        setSearchQuery(suggestion.trim());
    }

    useEffect(() => {
        if (searchQueryInput.trim().length < 2) {
            setSearchSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            window.innerTube.searchSuggestions(searchQueryInput.trim(), setSearchSuggestions);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchQueryInput]);

    return (
        <div className="relative">
            <form autoFocus className="flex justify-end gap-2 items-center" onSubmit={handleSearch}>
                <button type="button" className="focus:outline-none" onClick={handleBackBtn}>
                    <BackIcon className="size-6 text-black/60 dark:text-white/60 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                </button>
                <input
                    autoFocus
                    value={searchQueryInput}
                    onChange={(e) => setSearchQueryInput(e.target.value)}
                    id="searchQuery"
                    name="searchQuery"
                    type="text"
                    placeholder="Search"
                    className="w-full h-full py-1 ms-10 bg-inherit placeholder:text-black/60 dark:placeholder:text-white/60 text-end text-4xl border-b border-white/5 focus:outline-none focus:border-white/15 transition-colors duration-200 ease-in"
                />
                <button type="submit">
                    <SearchIcon className="size-8 text-black/60 dark:text-white/60 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                </button>
            </form>
            <div className="text-end text-2xl space-y-1.5 px-10">
                {searchSuggestions.map((suggestion, index) => {
                    return (
                        <a
                            key={index}
                            className="text-black/60 dark:text-white/60 line-clamp-1 hover:text-inherit transition-colors duration-200 ease-in"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchMain;
