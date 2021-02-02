const path=require("path");
const gulp=require("gulp");
const {src,dest}=require("gulp");
const ts=require("gulp-typescript");
const del=require("del");
const {WebSassRequire} = require("./plugins/web-sass-require.plugin");
const {SvgExtractPlugin} =require('./plugins/svg-extract-plugin');
const outDir="dest"


const build=gulp.series(
  ()=>del([outDir]),
  cb=>{
    return src("src/**/*.ts")
      .pipe(new WebSassRequire())
      .pipe(
       ts.createProject('tsconfig.json')()
      )
      .pipe(new SvgExtractPlugin({
        inputDir:"src"
      }))
      .pipe(dest(outDir))
  }

)

exports.default=build;