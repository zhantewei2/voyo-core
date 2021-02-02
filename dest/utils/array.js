export const sameArray = (arr, arr2) => {
    let index = 0;
    for (let i of arr) {
        if (i !== arr2[index])
            return false;
        index++;
    }
    return true;
};
