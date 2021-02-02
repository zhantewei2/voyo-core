export const getActivePage: () => {
  page: HTMLElement;
  pageEmbeddedContainer: any;
} = () => {
  //@ts-ignore
  const page: HTMLElement = document.querySelector("voyoc-page");
  if (!page) throw "not found voyoc-page";
  return {
    page,
    pageEmbeddedContainer: page,
  };
};
