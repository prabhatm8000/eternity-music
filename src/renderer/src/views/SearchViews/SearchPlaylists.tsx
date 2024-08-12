import { useSearchContext } from "@renderer/hooks/useSearchContext";

const SearchPlaylists = () => {
    const { searchQuery } = useSearchContext();
    return <div>Playlists: {searchQuery}</div>;
};

export default SearchPlaylists;
