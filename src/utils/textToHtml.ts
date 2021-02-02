export const textToHtml = (text: string): string => {
  return text
    .split(/\n|\n\r/)
    .filter(i => i)
    .map(line => `<div>${line}</div>`)
    .join("");
};
