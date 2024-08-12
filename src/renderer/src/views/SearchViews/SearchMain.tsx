import BackIcon from '@renderer/components/icons/BackIcon';
import SearchIcon from '@renderer/components/icons/SearchIcon';
import { useEffect, useState } from 'react';

const SearchMain = ({
    searchQuery,
    handleSearch,
    handleBackBtn
}: {
    searchQuery: string;
    handleSearch: (query: string) => void;
    handleBackBtn: () => void;
}) => {
    const [searchQueryInput, setSearchQueryInput] = useState<string>(searchQuery);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [suggestionIndexOnFocus, setSuggestionIndexOnFocus] = useState<number>(-1);

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQueryInput(suggestion);
        handleSearch(suggestion.trim());
    };

    const handleQuerySubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        const trimedSearchQuery = searchQueryInput.trim();
        handleSearch(trimedSearchQuery);
        if (searchQuery !== trimedSearchQuery) {
        }
    };

    // Search Suggestions (throttled)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQueryInput?.trim().length > 2) {
                window.innerTube.searchSuggestions(searchQueryInput.trim(), setSearchSuggestions);
                return;
            }
            setSearchSuggestions([]);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchQueryInput]);

    // Arrow key listeners
    useEffect(() => {
        const handleUpDownKeys = (ev: KeyboardEvent) => {
            if (ev.key === 'ArrowUp') {
                setSuggestionIndexOnFocus((prevIndex) => {
                    return prevIndex > 0 ? prevIndex - 1 : searchSuggestions.length - 1;
                });
            } else if (ev.key === 'ArrowDown') {
                setSuggestionIndexOnFocus((prevIndex) => {
                    return prevIndex < searchSuggestions.length - 1 ? prevIndex + 1 : 0;
                });
            } else if (ev.key === 'Enter' && suggestionIndexOnFocus > -1) {
                handleSuggestionClick(searchSuggestions[suggestionIndexOnFocus]);
            }
        };

        document.addEventListener('keydown', handleUpDownKeys);

        return () => {
            document.removeEventListener('keydown', handleUpDownKeys);
        };
    });

    return (
        <div className="relative">
            <form
                autoFocus
                className="flex justify-end gap-2 items-center"
                onSubmit={handleQuerySubmit}
            >
                <button type="button" className="focus:outline-none" onClick={handleBackBtn}>
                    <BackIcon className="size-6 text-black/60 dark:text-white/60 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                </button>
                <input
                    autoFocus
                    value={searchQueryInput}
                    onChange={(e) => setSearchQueryInput(e.target.value)}
                    onFocus={() => setSuggestionIndexOnFocus(-1)}
                    onBlur={() => setSuggestionIndexOnFocus(-1)}
                    id="searchQuery"
                    name="searchQuery"
                    type="text"
                    placeholder="Search"
                    className="w-full h-full py-1 ms-10 bg-inherit placeholder:text-black/40 dark:placeholder:text-white/40 text-end text-4xl border-b border-white/5 focus:outline-none focus:border-white/15 transition-colors duration-200 ease-in"
                />
                <button type="submit">
                    <SearchIcon className="size-8 text-black/40 dark:text-white/40 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                </button>
            </form>
            <div className="text-end text-2xl space-y-1.5 px-10">
                {searchSuggestions.map((suggestion, index) => {
                    return (
                        <a
                            key={index}
                            className={`${suggestionIndexOnFocus === index ? 'text-inherit' : 'text-black/40 dark:text-white/40'} line-clamp-1 hover:text-inherit transition-colors duration-200 ease-in`}
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
