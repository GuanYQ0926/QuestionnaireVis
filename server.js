const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')

const app = express()
app.use(serveStatic(__dirname))
// app.use("/", serveStatic(path.join(__dirname, '/dist')))



const port = process.env.PORT || 5000
app.listen(port, '0.0.0.0')
console.log('Server started on port ' + port)
// run at localhost:5000/dist/
