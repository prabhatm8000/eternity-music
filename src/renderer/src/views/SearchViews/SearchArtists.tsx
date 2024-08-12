import { useSearchContext } from "@renderer/hooks/useSearchContext";

const SearchArtists = () => {
    const { searchQuery } = useSearchContext();
    return <div>Artists: {searchQuery}</div>;
};

export default SearchArtists;
