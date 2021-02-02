const reg=/abc/g;
const cc='ztwabcxx'
const regResult=reg.exec(cc);
const firstIndex=regResult.index;
const lastIndex=reg.lastIndex
console.log(cc.slice(0,firstIndex)+'---'+cc.slice(lastIndex))