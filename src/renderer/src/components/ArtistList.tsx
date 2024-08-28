import type { Artist } from '@renderer/types';
import { useCallback, useRef } from 'react';
import ThumbnailRenderer from './ThumbnailRenderer';
import ArtistLoading from './loading/ArtistLoading';
import { useAppDispatch } from '@renderer/redux/hooks/app';

const ArtistList = ({
    artists,
    handleFetchMore,
    isLoading,
    isFetching
}: {
    artists: Artist[];
    handleFetchMore?: () => void;
    isLoading?: boolean;
    isFetching?: boolean;
}) => {
    const dispatch = useAppDispatch();

    const setBrowse = (browseId: string) => {
        dispatch({
            type: 'app/setBrowse',
            payload: {
                browseId,
                pageType: 'BROWSER_ARTIST'
            }
        });
    };

    const handleClick = (browseId: string) => {
        setBrowse(browseId);
    };

    const artistObserver = useRef<IntersectionObserver | null>(null);
    const lastArtistRef = useCallback(
        (element: HTMLDivElement) => {
            if (isFetching) return;

            if (artistObserver.current) artistObserver.current.disconnect();

            artistObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && handleFetchMore) {
                    handleFetchMore();
                }
            });

            if (element) artistObserver.current.observe(element);
        },
        [isFetching]
    );
    return (
        <div className="space-y-2 pe-2 overflow-y-auto h-full">
            {!isLoading &&
                artists?.map((artist: Artist, index) => (
                    <div
                        onClick={() => handleClick(artist.browserEndpoint.browseId)}
                        ref={index === artists.length - 1 ? lastArtistRef : undefined}
                        key={artist?.browserEndpoint.browseId + index}
                        className={`cursor-pointer p-2 grid grid-cols-[64px_1fr] gap-2 items-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-100 ease-in focus:outline-none`}
                    >
                        <ThumbnailRenderer
                            url={artist.thumbnail[artist.thumbnail.length - 1].url}
                            className="size-16 rounded-full"
                        />

                        <div className="-translate-y-0.5 flex flex-col justify-center leading-tight">
                            <h5 className="truncate text-lg">{artist.title}</h5>
                            <h6 className="truncate text-black/60 dark:text-white/60">
                                {artist.subscribers}
                            </h6>
                        </div>
                    </div>
                ))}

            {(isLoading || isFetching) && (
                <div className="text-center text-black/60 dark:text-white/60">
                    <ArtistLoading howMany={7} />
                </div>
            )}
        </div>
    );
};

export default ArtistList;
