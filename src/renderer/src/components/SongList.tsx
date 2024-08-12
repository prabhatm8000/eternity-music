import type { Song } from '@renderer/types';
import ThumbnailRenderer from './ThumbnailRenderer';
import thumbnailErrorImage from '../assets/error-thumbnail.svg';
import { useCallback, useRef } from 'react';

const SongList = ({
    songs,
    handleFetchMore,
    isFetching
}: {
    songs: Song[];
    handleFetchMore?: () => void;
    isFetching?: boolean;
}) => {
    const songObserver = useRef<IntersectionObserver | null>(null);
    const lastSongRef = useCallback(
        (element: HTMLDivElement) => {
            if (isFetching) return;

            if (songObserver.current) songObserver.current.disconnect();

            songObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && handleFetchMore) {
                    handleFetchMore();
                }
            });

            if (element) songObserver.current.observe(element);
        },
        [isFetching]
    );

    return (
        <div className="space-y-2 pe-2 overflow-y-auto h-full">
            {songs.map((song, index) => (
                <div
                    ref={index === songs.length - 1 ? lastSongRef : undefined}
                    key={song.watchEndpoint.videoId + index}
                    className="p-2 grid grid-cols-[64px_1fr] gap-2 items-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-100 ease-in focus:outline-none"
                >
                    <ThumbnailRenderer
                        url={song.thumbnail[song.thumbnail.length - 1].url}
                        errorImageUrl={thumbnailErrorImage}
                        imageClassName="size-16"
                    />

                    <div className="-translate-y-0.5 grid grid-cols-[calc(100%-80px-16px)_80px] gap-4 items-center leading-tight">
                        <div className='w-[250px] md:w-[350px] lg:w-[500px] xl:w-[600px]'>
                            <h5 className="truncate text-lg">{song.title}</h5>
                            <h6 className="truncate text-black/60 dark:text-white/60">
                                {song.artist.map((artist) => artist.name).join(', ')}
                            </h6>
                        </div>
                        <div className="text-end flex flex-col">
                            <span className="text-sm text-black/60 dark:text-white/60">
                                {song.duration}
                            </span>
                            <span className="text-sm text-black/60 dark:text-white/60">
                                {song.plays}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {isFetching && (
                <div className="text-center text-black/60 dark:text-white/60">Loading...</div>
            )}
        </div>
    );
};

export default SongList;
