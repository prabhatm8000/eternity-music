import BackIcon from '@renderer/components/icons/BackIcon';
import { useAppDispatch } from '@renderer/redux/hooks/app';
import type { AlbumPage, ArtistPage, PlaylistPage } from '@renderer/types';
import { useEffect, useState } from 'react';
import BrowseAlbum from './BrowseViews/BrowseAlbum';
import BrowseArtist from './BrowseViews/BrowseArtist';

const Browse = ({
    browseId,
    pageType
}: {
    browseId: string;
    pageType: 'BROWSER_ALBUM' | 'BROWSER_ARTIST' | 'BROWSER_PLAYLIST';
}) => {
    const dispatch = useAppDispatch();

    const handleBackBtn = () => {
        dispatch({ type: 'app/setBrowse', payload: null });
    };

    const [browseData, setBrowseData] = useState<AlbumPage | ArtistPage | PlaylistPage | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.innerTube.browse(
            {
                browseId,
                pageType:
                    pageType === 'BROWSER_ALBUM'
                        ? 'ALBUM'
                        : pageType === 'BROWSER_ARTIST'
                          ? 'ARTIST'
                          : 'PLAYLIST'
            },
            (result) => {
                console.log('browse result: ', result);
                setBrowseData(result);
                setIsLoading(false);
            }
        );
    }, []);

    return (
        <div className="relative">
            <div autoFocus className="my-2 w-full flex gap-2 items-center focus:outline-none">
                <button type="button" className="focus:outline-none" onClick={handleBackBtn}>
                    <BackIcon className="size-6 text-black/60 dark:text-white/60 hover:text-inherit transition-colors duration-200 ease-in focus:outline-none" />
                </button>
            </div>

            {browseData && (
                <>
                    {pageType === 'BROWSER_ALBUM' && (
                        <BrowseAlbum browseData={browseData as AlbumPage} />
                    )}
                    {pageType === 'BROWSER_ARTIST' && (
                        <BrowseArtist browseData={browseData as ArtistPage} />
                    )}
                </>
            )}

            {isLoading && <div>Loading...</div>}
            {!isLoading && !browseData && <div>{'Something went wrong'}</div>}
        </div>
    );
};

export default Browse;
