const nodeSass=require("node-sass");
const fs=require("fs/promises");
const {promisify}=require("util");
const postcss=require("postcss");
const packageImporter=require("node-sass-package-importer");
const postcssrc=require("postcss-load-config");

exports.sassLoader=async(filePath)=>{
  let cssResult="";
  try {
    // sass-loader
    const scssResult = await promisify(nodeSass.render)({
      file: filePath,
      importer: packageImporter()
    });
    cssResult=scssResult.css?scssResult.css.toString():'';
    // postcss-loader
    const postcssResult=await postcssrc({}).then(({plugins,options})=>{
      return postcss(plugins).process(cssResult,{from:undefined});
    });
    cssResult=postcssResult.css;
  }catch (e) {
    console.error(e);
  }
  return cssResult;
}