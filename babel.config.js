let prodPlugins =[]
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}else if(process.env.NODE_ENV === 'development'){

}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins:[
    ...prodPlugins
  ]
}
