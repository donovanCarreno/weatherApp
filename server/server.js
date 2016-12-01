const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const app = express()
const apiKey = process.env.apiKey
const mapsKey = process.env.mapsKey

const getLatLong = function(req, res, next) {
  https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.address}&key=${mapsKey}`, (gmRes) => {
    let body = ''

    gmRes.on('data', (data) => {
      body += data
    })

    gmRes.on('end', () => {
      req.body.geoData = JSON.parse(body)
      return next()
    })
  })
}

const getWeatherData = function(req, res, next) {
  let lat = req.body.geoData.results[0].geometry.location.lat
  let long = req.body.geoData.results[0].geometry.location.lng

  https.get(`https://api.darksky.net/forecast/${apiKey}/${lat},${long}`, (dsRes) => {
    let body = ''

    dsRes.on('data', (data) => {
      body += data
    })

    dsRes.on('end', () => {
      req.body.weather = JSON.parse(body)
      return next()
    })
  })
}

app.use(bodyParser.json())
app.use(express.static(__dirname + '/../public'))

app.get('/forecast/:address', getLatLong, getWeatherData, (req, res) => {
  res.json(req.body.weather)
})

module.exports = app
