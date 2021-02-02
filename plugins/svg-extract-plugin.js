const {Duplex} = require("stream");
const {getUniqueId}= require("@ztwx/utils/main/uniqueId");
const path=require('path');
const fs=require('fs/promises');
const Vinyl=require("vinyl");
const getImportSvgReg=()=>/(?<=[\n;^])\s*import\s+([^\s]+)\s+from\s+(?<quo>['"])(.*?\.svg)\k<quo>/g

class SvgExtractPlugin extends Duplex{
  /**
   *
   * @type {*[]}
   * filePath fileName fileContent
   */
  svgList=[];

  constructor({inputDir,svgFile='svg.js'}) {
    super();
    this.inputDir=inputDir;
    this.svgFile=svgFile;
    this.svgAbsFile=path.join(process.cwd(),this.inputDir,this.svgFile);
  }

  writeCount=0;
  readCount=0;

  async extractSvgImport(file,content){
    const filePath=file.path;
    const svgReg=getImportSvgReg();
    let svgRegResult=svgReg.exec(content);
    if(svgRegResult){
      const quoteName=svgRegResult[1];
      const quoteRelativePath=svgRegResult[3];
      const svgFilePath=path.resolve(path.dirname(filePath),quoteRelativePath);
      const svgExtractFileRelativePath=path.relative(path.dirname(filePath),this.svgAbsFile).replace(/\\/g,'/');
      let svgItem=this.svgList.find(i=>i.filePath===svgFilePath);

      if(!svgItem){
        try {
          let svgContent = await fs.readFile(svgFilePath);
          svgContent=svgContent.toString('base64');
          svgItem={
            filePath:svgFilePath,
            fileName:getUniqueId(),
            fileContent:svgContent
          }
          this.svgList.push(svgItem)
        }catch (e) {
          console.error(e);
          return file;
        }
      }
      content=content.slice(0,svgRegResult.index)+'\n'+`import { ${svgItem.fileName} as ${quoteName} } from "${svgExtractFileRelativePath.replace(/\.ts/,'')}"`+content.slice(svgReg.lastIndex,content.length+1);
      // if(file.path.match(/input\.component\.ts/)){
      //   await fs.writeFile(path.join(process.cwd(),'2.ts'),content,'utf8');
      // }
      return await this.extractSvgImport(file,content);
    }else{
      file.contents=Buffer.from(content);
      return file;
    }
  }


  writeComplete(){
    const cwd=process.cwd();
    const svgFile=new Vinyl({
      cwd,
      base: path.join(cwd,this.inputDir),
      path: this.svgAbsFile,
      contents: Buffer.from(this.svgList.map(i=>`export const ${i.fileName} = "data:image/svg+xml;base64,${i.fileContent}";`).join("\n"))
    });
    this.emit("data",svgFile);
    this.emit('end');
  }

  read(size) {
    this.cb=async(file)=>{
      file=await this.extractSvgImport(file,file.contents.toString('utf-8'));
      this.emit('data',file);
      this.readCount++;
      if(this.readEnd&&this.readCount===this.writeCount)this.writeComplete();
    }
    return null;
  }
  write(file, encoding, cb) {
    this.writeCount++;
    this.cb&&this.cb(file);
  }
  end(cb) {
    this.readEnd=true;
  }
}

exports.SvgExtractPlugin=SvgExtractPlugin;