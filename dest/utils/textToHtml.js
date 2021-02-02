export const textToHtml = (text) => {
    return text
        .split(/\n|\n\r/)
        .filter(i => i)
        .map(line => `<div>${line}</div>`)
        .join("");
};
