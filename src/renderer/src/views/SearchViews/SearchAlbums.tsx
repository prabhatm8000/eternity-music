import { useSearchContext } from "@renderer/hooks/useSearchContext";

const SearchAlbums = () => {
    const { searchQuery } = useSearchContext();
    return <div>Albums: {searchQuery}</div>;
};

export default SearchAlbums;
