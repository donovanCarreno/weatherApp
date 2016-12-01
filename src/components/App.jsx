import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import {apiKey, mapsKey} from '../../key'
import InputForm from './InputForm'
import {Details} from './Details'

class App extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.currentLocation = this.currentLocation.bind(this)
    this.state = {
      address: '',
      daily: {},
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

  handleSubmit(address) {
    if (address !== this.state.address) {
      browserHistory.push(`/forecast/${address}`)
      fetch(`/forecast/${address}`)
      .then(res => (
        res.json()
        .then(data => {
          let summary = data.hourly.summary
          let temp = Math.round(data.currently.temperature).toFixed(0)

          this.setState({
            daily: data.daily,
            landing: false,
            summary,
            temp
          })
        })
      ))
    }
  }

  componentDidMount() {
    let search = document.getElementById('search')
    let autocomplete = new google.maps.places.Autocomplete(search, {types: ['(cities)']})

    autocomplete.addListener('place_changed',() => {
      let address = autocomplete.getPlace().formatted_address.split(',')
      address.pop()
      address = address.join()
      this.setState({address})
    })
  }

  render() {
    return (
      <div className="container">
        <header>
          <InputForm
            address={this.state.address}
            currentLocation={this.currentLocation}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
        </header>
        <div className="main">
          {this.state.landing ? (
            <img className="landing" src="/landing.jpg" />
          ) : (
            <Details
              address={this.state.address}
              daily={this.state.daily}
              summary={this.state.summary}
              temp={this.state.temp}
            />
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
    <Route path='/' component={App} />
    <Route path='/forecast/:address' component={App} />
  </Router>
), document.getElementById('app'))
