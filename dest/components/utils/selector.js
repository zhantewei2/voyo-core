export const getActivePage = () => {
    //@ts-ignore
    const page = document.querySelector("voyoc-page");
    if (!page)
        throw "not found voyoc-page";
    return {
        page,
        pageEmbeddedContainer: page,
    };
};
