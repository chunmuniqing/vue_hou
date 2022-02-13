module.exports ={
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  parser: "vue-eslint-parser",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules:{
    "no-debugger":process.env.NODE_ENV === 'production'?'warn':'off',
    "no-console":process.env.NODE_ENV === 'production'?'warn':'off',
    'no-use-before-define':'off'
  }
}