const path=require("path");


module.exports={
  plugins:[
    require("postcss-preset-env")({
      browsers:"IOS>=9,chrome 39,not IE 11"
    }),
    require("cssnano")({})
  ]
}