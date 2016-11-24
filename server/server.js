const express = require('express')
const app = express()

app.use(express.static(__dirname + '/../public'))

app.get('/test', function (req, res) {
  console.log('hola')
  res.status(200).json({server: "data!"})
})

module.exports = app
