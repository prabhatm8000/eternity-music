import type { Song, Video } from '@renderer/types';
import { useCallback, useRef } from 'react';
import ThumbnailRenderer from './ThumbnailRenderer';

const TrackList = ({
    tracks,
    isSongs,
    handleFetchMore,
    isLoading,
    isFetching
}: {
    tracks: Song[] | Video[];
    isSongs: boolean;
    handleFetchMore?: () => void;
    isLoading?: boolean;
    isFetching?: boolean;
}) => {
    const songObserver = useRef<IntersectionObserver | null>(null);
    const lastTrackRef = useCallback(
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
            {!isLoading &&
                tracks.map((track: Song | Video, index) => (
                    <div
                        ref={index === tracks.length - 1 ? lastTrackRef : undefined}
                        key={track?.watchEndpoint?.videoId + index}
                        className={`p-2 grid ${isSongs ? 'grid-cols-[64px_1fr]' : 'grid-cols-[112px_1fr]'} gap-2 items-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-100 ease-in focus:outline-none`}
                    >
                        <ThumbnailRenderer
                            url={track.thumbnail[track.thumbnail.length - 1].url}
                            className={`${isSongs ? 'size-16' : 'h-16 w-28'} rounded-sm`}
                        />

                        <div className="-translate-y-0.5 grid grid-cols-[calc(100%-90px-16px)_90px] gap-4 items-center leading-tight">
                            <div
                                className={
                                    isSongs
                                        ? 'w-[250px] md:w-[350px] lg:w-[500px] xl:w-[600px]'
                                        : 'w-[202px] md:w-[302px] lg:w-[452px] xl:w-[552px]'
                                }
                            >
                                <h5 className="truncate text-lg">{track.title}</h5>
                                <h6 className="truncate text-black/60 dark:text-white/60">
                                    {track.artist.map((artist) => artist.name).join(', ')}
                                </h6>
                            </div>
                            <div className="text-end flex flex-col">
                                <span className="text-sm text-black/60 dark:text-white/60">
                                    {track.duration}
                                </span>
                                <span className="text-sm text-black/60 dark:text-white/60">
                                    {'plays' in track ? track.plays : ''}
                                    {'views' in track ? track.views : ''}
                                </span>
                            </div>
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

export default TrackList;
