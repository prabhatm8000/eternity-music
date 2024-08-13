import { useState } from 'react';

const ThumbnailRenderer = ({
    url,
    errorImageUrl,
    className = 'size-16'
}: {
    url: string;
    errorImageUrl: string | any;
    className?: string;
}) => {
    const [imageUrl, setImageUrl] = useState<string | any>(url);

    return (
        <img
            onError={() => setImageUrl(errorImageUrl)}
            src={imageUrl}
            alt="Thumbnail"
            className={className + " rounded-sm object-cover"}
        />
    );
};

export default ThumbnailRenderer;
