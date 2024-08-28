import AlbumList from '@renderer/components/AlbumList';
import ThumbnailRenderer from '@renderer/components/ThumbnailRenderer';
import TrackList from '@renderer/components/TrackList';
import type { Album, ArtistPage, Song } from '@renderer/types';
import { useState } from 'react';

type TabType = 'SONGS' | 'ALBUMS' | 'SINGLES' | 'ABOUT';
const tabsToRender: { id: TabType; label: string }[] = [
    {
        id: 'SONGS',
        label: 'Songs'
    },
    {
        id: 'SINGLES',
        label: 'Singles'
    },
    {
        id: 'ALBUMS',
        label: 'Albums'
    },
    {
        id: 'ABOUT',
        label: 'About'
    }
];

const BrowseArtist = ({ browseData }: { browseData: ArtistPage }) => {
    const [tabIndexOnFocus, setTabIndexOnFocus] = useState<number>(0);
    const [searchResultTabsOnFocus, setSearchResultTabsOnFocus] = useState<boolean>(false);

    return (
        <>
            <div className="px-4 grid grid-cols-[1fr_208px] gap-4 w-full mb-2">
                <div className="-translate-y-0.5 flex flex-col justify-center items-end gap-2 leading-tight w-full">
                    <h5 className="truncate text-4xl w-[152px] md:w-[250px] lg:w-[500px] xl:w-[600px] text-end">
                        {browseData.name}
                    </h5>
                </div>
                <ThumbnailRenderer
                    url={browseData.thumbnail[2].url || browseData.thumbnail[1].url}
                    className="size-52 rounded-sm"
                />
            </div>

            {/* tabs */}
            <div
                tabIndex={2}
                onFocus={() => setSearchResultTabsOnFocus(true)}
                onBlur={() => setSearchResultTabsOnFocus(false)}
                className="focus:outline-none"
            >
                <ul
                    className={`flex gap-4 border-b ${searchResultTabsOnFocus ? 'border-black/30 dark:border-white/30' : 'border-black/10 dark:border-white/10'}`}
                >
                    {tabsToRender.map((tabToRender, index) => (
                        <li
                            key={index + tabToRender.id}
                            className={`cursor-pointer ${tabsToRender[tabIndexOnFocus].id !== tabToRender.id ? 'text-black/60 dark:text-white/60 border-transparent' : 'pb-2 border-black dark:border-white'} border-b hover:border-black/30 hover:dark:border-white/30 transition-all duration-100 ease-in-out`}
                            onClick={() => setTabIndexOnFocus(index)}
                        >
                            {tabToRender.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* search result tabs */}
            <div
                tabIndex={2}
                onFocus={() => setSearchResultTabsOnFocus(true)}
                onBlur={() => setSearchResultTabsOnFocus(false)}
                id="search-result-container"
                className={`focus:outline-none py-3 me-2 h-[calc(100vh-310px-80px)] overflow-x-scroll`}
            >
                {tabsToRender[tabIndexOnFocus].id === 'SONGS' && (
                    <TrackList tracks={(browseData.songs as Song[]) || []} isSongs={true} />
                )}

                {tabsToRender[tabIndexOnFocus].id === 'SINGLES' && (
                    <AlbumList albums={(browseData.singles as Album[]) || []} />
                )}

                {tabsToRender[tabIndexOnFocus].id === 'ALBUMS' && (
                    <AlbumList albums={(browseData.albums as Album[]) || []} />
                )}

                {tabsToRender[tabIndexOnFocus].id === 'ABOUT' && (
                    <div className="text-black/60 dark:text-white/60 w-full">
                        {browseData.description}
                    </div>
                )}
            </div>
        </>
    );
};

export default BrowseArtist;
