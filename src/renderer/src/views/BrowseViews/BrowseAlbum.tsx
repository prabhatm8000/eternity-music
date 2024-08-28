import ThumbnailRenderer from '@renderer/components/ThumbnailRenderer';
import TrackList from '@renderer/components/TrackList';
import type { AlbumPage, Song } from '@renderer/types';

const BrowseAlbum = ({ browseData }: { browseData: AlbumPage }) => {
    return (
        <>
            <div className="px-4 grid grid-cols-[1fr_208px] gap-4 w-full mb-2">
                <div className="-translate-y-0.5 flex flex-col justify-center items-end gap-2 leading-tight w-full">
                    <h5 className="truncate text-4xl w-[152px] md:w-[350px] lg:w-[500px] xl:w-[600px] text-end">
                        {browseData.title}
                    </h5>
                    <h6 className="truncate text-black/60 dark:text-white/60 w-[192px] md:w-[330px] lg:w-[500px] xl:w-[600px] text-end">
                        {browseData.artist.map((artist) => artist.name).join(', ')}
                    </h6>
                    <h6 className="truncate text-black/60 dark:text-white/60 w-[192px] md:w-[330px] lg:w-[500px] xl:w-[600px] text-end">
                        {browseData.totalDuration}
                    </h6>
                    <h6 className="truncate text-black/60 dark:text-white/60 w-[192px] md:w-[330px] lg:w-[500px] xl:w-[600px] text-end">
                        {browseData.year}
                    </h6>
                </div>
                <ThumbnailRenderer
                    url={browseData.thumbnail[2]?.url || browseData.thumbnail[1]?.url}
                    className="size-52 rounded-sm"
                />
            </div>

            <div
                id="search-result-container"
                className={`focus:outline-none py-3 h-[calc(100vh-120px-80px)] overflow-x-scroll`}
            >
                <TrackList tracks={(browseData.songs as Song[]) || []} isSongs={true} />
            </div>
        </>
    );
};

export default BrowseAlbum;
