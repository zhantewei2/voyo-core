export const sameArray = (arr: any[], arr2: any[]) => {
  let index: number = 0;
  for (let i of arr) {
    if (i !== arr2[index]) return false;
    index++;
  }
  return true;
};
