import { useState } from 'react';

const ThumbnailRenderer = ({
    url,
    errorImageUrl,
    imageClassName = 'size-24'
}: {
    url: string;
    errorImageUrl: string | any;
    imageClassName?: string;
}) => {
    const [imageUrl, setImageUrl] = useState<string | any>(url);

    return (
        <img
            onError={() => setImageUrl(errorImageUrl)}
            src={imageUrl}
            alt="Thumbnail"
            className={imageClassName + " rounded-sm object-cover"}
        />
    );
};

export default ThumbnailRenderer;
