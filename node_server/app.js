const express = require('express')
const compression = require('compression')
const app = express()
app.use(compression())
app.use(express.static('./dist'))
app.listen(443,()=>{
  console.log('server start:127.0.0.1:443');
})