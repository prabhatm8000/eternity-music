const TrackLoading = ({ howMany, isSongs }: { howMany: number; isSongs: boolean }) => {
    const components: JSX.Element[] = [];

    for (let index = 0; index < howMany; index++) {
        components.push(
            <div
                key={index + '_loading_track_' + isSongs}
                className={`p-2 w-full grid ${isSongs ? 'grid-cols-[64px_1fr]' : 'grid-cols-[112px_1fr]'} gap-2 items-center rounded-md focus:outline-none`}
                style={{
                    opacity: (howMany - index + 1) / howMany
                }}
            >
                <div
                    className={`${isSongs ? 'size-16' : 'h-16 w-28'} rounded-sm bg-black/10 dark:bg-white/10 `}
                />

                <div className="-translate-y-0.5 grid grid-cols-[calc(100%-90px-16px)_90px] gap-4 items-center">
                    <div
                        className={
                            isSongs
                                ? 'w-[250px] md:w-[350px] lg:w-[500px] xl:w-[600px]'
                                : 'w-[202px] md:w-[302px] lg:w-[452px] xl:w-[552px]'
                        }
                    >
                        <div className="py-2 w-36 mb-2 bg-black/10 dark:bg-white/10"></div>
                        <div className="py-2 w-16 bg-black/10 dark:bg-white/10"></div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="py-2 w-10 mb-2 bg-black/10 dark:bg-white/10"></div>
                        <div className="py-2 w-16 bg-black/10 dark:bg-white/10"></div>
                    </div>
                </div>
            </div>
        );
    }

    return <div className="flex flex-col gap-2 w-full animate-pulse">{components}</div>;
};

export default TrackLoading;
