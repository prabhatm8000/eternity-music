import { useState } from 'react';

const ThumbnailRenderer = ({ url, className = 'size-16' }: { url: string; className?: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <>
            <img
                onError={() => setImageError(true)}
                src={url}
                alt="Thumbnail"
                className={`${className} object-cover ${imageError ? 'hidden' : ''} transition-opacity duration-200 ease-out`}
            />
            {imageError && <div className={`${className} object-cover bg-black/20 dark:bg-white/20`}></div>}
        </>
    );
};

export default ThumbnailRenderer;
