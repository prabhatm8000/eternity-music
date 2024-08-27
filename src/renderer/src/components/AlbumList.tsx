import type { Album } from '@renderer/types';
import { useCallback, useRef } from 'react';
import ThumbnailRenderer from './ThumbnailRenderer';
import AlbumLoading from './loading/AlbumLoading';

const AlbumList = ({
    albums,
    handleFetchMore,
    isLoading,
    isFetching
}: {
    albums: Album[];
    handleFetchMore?: () => void;
    isLoading?: boolean;
    isFetching?: boolean;
}) => {
    const albumObserver = useRef<IntersectionObserver | null>(null);
    const lastAlbumRef = useCallback(
        (element: HTMLDivElement) => {
            if (isFetching) return;

            if (albumObserver.current) albumObserver.current.disconnect();

            albumObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && handleFetchMore) {
                    handleFetchMore();
                }
            });

            if (element) albumObserver.current.observe(element);
        },
        [isFetching]
    );

    return (
        <div className="space-y-2 pe-2 overflow-y-auto h-full">
            {!isLoading &&
                albums?.map((album: Album, index) => (
                    <div
                        ref={index === albums.length - 1 ? lastAlbumRef : undefined}
                        key={album?.browserEndpoint.browseId + index}
                        className={`p-2 grid grid-cols-[112px_1fr] gap-2 items-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-100 ease-in focus:outline-none`}
                    >
                        <ThumbnailRenderer
                            url={album.thumbnail[album.thumbnail.length - 1].url}
                            className="size-28 rounded-sm"
                        />

                        <div className="-translate-y-0.5 flex flex-col justify-center leading-tight w-[202px] md:w-[400px] lg:w-[550px] xl:w-[650px]">
                            <h5 className="truncate text-lg">{album.title}</h5>
                            <h6 className="truncate text-black/60 dark:text-white/60">
                                {album.artist.map((artist) => artist.name).join(', ')}
                            </h6>
                            <h6 className="truncate text-black/60 dark:text-white/60">
                                {album.year}
                            </h6>
                        </div>
                    </div>
                ))}

            {(isLoading || isFetching) && (
                <div className="text-center text-black/60 dark:text-white/60">
                    <AlbumLoading howMany={7} />
                </div>
            )}
        </div>
    );
};

export default AlbumList;
