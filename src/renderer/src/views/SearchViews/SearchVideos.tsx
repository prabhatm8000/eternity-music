import { useSearchContext } from "@renderer/hooks/useSearchContext";

const SearchVideos = () => {
    const { searchQuery } = useSearchContext();
    return <div>Videos: {searchQuery}</div>;
};

export default SearchVideos;
