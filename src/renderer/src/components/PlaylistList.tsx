import type { Playlist } from '@renderer/types';
import { useCallback, useRef } from 'react';
import ThumbnailRenderer from './ThumbnailRenderer';

const PlaylistList = ({
    playlists,
    handleFetchMore,
    isLoading,
    isFetching
}: {
    playlists: Playlist[];
    handleFetchMore?: () => void;
    isLoading?: boolean;
    isFetching?: boolean;
}) => {
    const playlistObserver = useRef<IntersectionObserver | null>(null);
    const lastPlaylistRef = useCallback(
        (element: HTMLDivElement) => {
            if (isFetching) return;

            if (playlistObserver.current) playlistObserver.current.disconnect();

            playlistObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && handleFetchMore) {
                    handleFetchMore();
                }
            });

            if (element) playlistObserver.current.observe(element);
        },
        [isFetching]
    );
    return (
        <div className="space-y-2 pe-2 overflow-y-auto h-full">
            {!isLoading &&
                playlists?.map((playlist: Playlist, index) => (
                    <div
                        ref={index === playlists.length - 2 ? lastPlaylistRef : undefined}
                        key={playlist?.browserEndpoint.browseId + index}
                        className={`p-2 grid grid-cols-[112px_1fr] gap-2 items-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-100 ease-in focus:outline-none`}
                    >
                        <ThumbnailRenderer
                            url={playlist.thumbnail[playlist.thumbnail.length - 1].url}
                            className="size-28 rounded-sm"
                        />

                        <div className="-translate-y-0.5 flex flex-col justify-center leading-tight w-[202px] md:w-[400px] lg:w-[550px] xl:w-[650px]">
                            <h5 className="truncate text-lg">{playlist.title}</h5>
                            <h6 className="truncate text-black/60 dark:text-white/60">
                                {playlist.artist.map((artist) => artist.name).join(', ')}
                            </h6>
                        </div>
                    </div>
                ))}

            {(isLoading || isFetching) && (
                <div className="text-center text-black/60 dark:text-white/60">
                    {isLoading ? 'loading...' : 'fetching more...'}
                </div>
            )}
        </div>
    );
};

export default PlaylistList;
