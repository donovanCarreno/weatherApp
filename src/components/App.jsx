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
      landing: true,
      summary: '',
      temp: null
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
          landing: false,
          summary,
          temp
        })
      })
    })
  }

  componentDidMount() {
    let search = document.getElementById('search')
    let autocomplete = new google.maps.places.Autocomplete(search, {types: ['(cities)']})
    autocomplete.addListener('place_changed',() => {
      let address = autocomplete.getPlace().formatted_address.split(',')
      address.pop()
      address = address.join()

      this.setState({address})
      this.handleSubmit()
    })
  }

  render() {
    return (
      <div className="container">
        <header>
          <form onSubmit={this.handleSubmit}>
            <input id="search" value={this.state.address} onChange={this.handleChange} ref="input" type='text' placeholder='City, ST'/>
            <img className="gps" src="/gps.png" onClick={this.currentLocation} />
          </form>
        </header>
        <div className="main">
          {this.state.landing ? (
            <img className="landing" src="/landing.jpg" />
          ) : (
            <div className="details">
              <div className="today">
                <p className="summary">{this.state.summary}</p>
                <p className="temp">{this.state.temp}&#8457;</p>
                <p className="city">{this.state.address}</p>
              </div>
              <div className="daily">
              <span>Next 7 days</span>
              {this.state.data.daily ? this.state.data.daily.data.map((day, i) => {
                if (i == 0) return
                return <Day key={day.time} day={day}/>
              }) : 'nada'}
              </div>
            </div>
          )}
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
