const {Duplex} = require("stream");
const path =require("path");
const {sassLoader}=require('./web-sass-loader');
const getScssRequireReg=()=>/require\(\s?(['"])(.*?\.webscss\s*)\1\s?\)/g;



class WebSassRequirePlugin extends Duplex{
  readCount=0;
  execCount=0;
  endCount=null;
  constructor() {
    super();
  }
  async extralWebsass(file,content){
    const scssRequireReg=getScssRequireReg();
    const execResult=scssRequireReg.exec(content);
    let startIndex;
    let endIndex;
    if(execResult){
      startIndex=execResult.index;
      endIndex=scssRequireReg.lastIndex;
      const filePath=execResult[2].trim();
      const fileAbsPath=path.join(path.dirname(file.path),filePath);
      //await sass loader handler
      const cssResult=await sassLoader(fileAbsPath);

      content=content.slice(0,startIndex)+`'${cssResult}'`+content.slice(endIndex);
      return await this.extralWebsass(file,content);
    }else {
      file.contents=Buffer.from(content);
      return file;
    }
  }

  async write(file, encoding, cb) {
    this.readCount++;
    file=await this.extralWebsass(file,file.contents.toString('utf-8'));
    this.readCb(file);
  }
  read(size) {
    this.readCb=(chunk)=>{
      this.emit("data",chunk);
      this.execCount++;
      // console.log(this.readCount,this.execCount)
      if(this.readCount===this.endCount&&this.execCount===this.endCount){
        this.emit("end")
      }
    }
    return null;
  }
  end(cb) {
    this.endCount=this.readCount;
  }

}


exports.WebSassRequire=WebSassRequirePlugin;