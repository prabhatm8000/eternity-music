export const scrollToTopInElement = (element: HTMLDivElement | undefined) => {
    if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
