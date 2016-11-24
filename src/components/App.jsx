import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {apiKey, mapsKey} from '../../key'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: {
        default: "stuff"
      },
      icon: 'http://bit.ly/2fW8bgt',
      temp: 55
    }
  }

  componentDidMount() {
    $.ajax(`https://api.darksky.net/forecast/${apiKey}/43.5446,-96.7311`, {
      dataType: "jsonp"
    })
    .then((data) => {
      let icon = this.state.icon
      let summary = data.currently.summary
      let temp = Math.round(data.currently.temperature).toFixed(0)
      // http://bit.ly/2glGXR6 cloudy
      if (data.currently.icon === 'cloudy') {
        icon = 'http://bit.ly/1NlhgeK'
      }

      this.setState({
        data,
        icon,
        summary,
        temp
      })
    })
    // this.setState({
    //   temp: Math.round(this.state.temp).toFixed(0)
    // })
  }

  render() {
    return (
      <div className="container">
        <header>This is my header</header>
        <div className="main">
          <p className="summary">{this.state.summary}</p>
          <p className="temp">{this.state.temp}&#8457;</p>
          <p className="city">Sioux Falls, SD</p>
          <img src={this.state.icon}></img>
        </div>
        <footer>This is my footer</footer>
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
