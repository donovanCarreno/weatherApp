import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {apiKey, mapsKey} from '../../key'
import {Day} from './Day'
import {mockData} from '../../mockData'

class App extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.currentLocation = this.currentLocation.bind(this)
    this.state = {
      address: '',
      data: mockData,
      icon: 'http://bit.ly/1NlhgeK',
      summary: mockData.hourly.summary,
      temp: 55
    }
  }

  currentLocation(e) {
    navigator.geolocation.getCurrentPosition((position) => {
      $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${mapsKey}`)
      .then((addressData) => {
        let address = `${addressData.results[0].address_components[2].short_name}, ${addressData.results[0].address_components[4].short_name}`
        this.setState({address})
        this.handleSubmit()
      })
    })
  }

  handleChange(e) {
    e.preventDefault()

    this.setState({
      address: e.target.value
    })
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }

    this.refs.input.blur()

    $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.address}&key=${mapsKey}`)
    .then((geoData) => {
      let lat = geoData.results[0].geometry.location.lat
      let long = geoData.results[0].geometry.location.lng

      $.ajax(`https://api.darksky.net/forecast/${apiKey}/${lat},${long}`, {
        dataType: "jsonp"
      })
      .then((data) => {
        let icon = this.state.icon
        let summary = data.hourly.summary
        let temp = Math.round(data.currently.temperature).toFixed(0)
        // http://bit.ly/2glGXR6 cloudy
        // if (data.currently.icon === 'cloudy') {
        //   icon = 'http://bit.ly/1NlhgeK'
        // }

        this.setState({
          data,
          icon,
          summary,
          temp
        })
      })
    })
  }

  render() {
    return (
      <div className="container">
        <header>This is my header</header>
        <div className="main">
          <form onSubmit={this.handleSubmit}>
            <input onChange={this.handleChange} ref="input" type='text' placeholder='City, ST'/>
            <img src="/gps.png" onClick={this.currentLocation} />
            {/* <input type='submit' value='Submit' hidden/> */}
          </form>
          <div className="today">
            <p className="summary">{this.state.summary}</p>
            <p className="temp">{this.state.temp}&#8457;</p>
            <p className="city">{this.state.address}</p>
            {/* <img src={this.state.icon}></img> */}
          </div>
          <div className="daily">
          <span>Next 7 days</span>
          {this.state.data.daily ? this.state.data.daily.data.map((day, i) => {
            if (i == 0) return
            return <Day key={day.time} day={day}/>
          }) : 'nada'}
          </div>
        </div>
        <div className="footer">
          <footer><a href="https://darksky.net/poweredby/">Powered by Dark Sky</a></footer>
        </div>
      </div>
    )
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={App} />
      <Route path="/test" component={App} />
    </Route>
  </Router>
), document.getElementById('app'))
