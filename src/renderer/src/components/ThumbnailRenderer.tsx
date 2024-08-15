import { useState } from 'react';

const ThumbnailRenderer = ({ url, className = 'size-16' }: { url: string; className?: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <>
            <img
                onError={() => setImageError(true)}
                src={url}
                alt="Thumbnail"
                className={`${className} object-cover ${imageError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 ease-out`}
            />
            {imageError && <div className={`${className} object-cover bg-gray-600`}></div>}
        </>
    );
};

export default ThumbnailRenderer;
