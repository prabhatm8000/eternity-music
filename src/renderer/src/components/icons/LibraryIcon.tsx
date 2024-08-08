const LibraryIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            className={className}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"></path>
        </svg>
    );
};

export default LibraryIcon;
