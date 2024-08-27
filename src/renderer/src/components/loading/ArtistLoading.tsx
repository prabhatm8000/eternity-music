const ArtistLoading = ({ howMany }: { howMany: number }) => {
    const components: JSX.Element[] = [];

    for (let index = 0; index < howMany; index++) {
        components.push(
            <div
                key={index + '_loading_artist'}
                className={`p-2 w-full grid grid-cols-[64px_1fr] gap-2 items-center rounded-md`}
                style={{
                    opacity: (howMany - index + 1) / howMany
                }}
            >
                <div className={`size-16 rounded-full bg-black/10 dark:bg-white/10 `} />

                <div className="-translate-y-0.5 flex flex-col justify-center">
                    <div className="py-2 w-36 mb-2 bg-black/10 dark:bg-white/10"></div>
                    <div className="py-2 w-16 bg-black/10 dark:bg-white/10"></div>
                </div>
            </div>
        );
    }

    return <div className="flex flex-col gap-2 w-full animate-pulse">{components}</div>;
};

export default ArtistLoading;
