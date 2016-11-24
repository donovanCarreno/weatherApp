import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {apiKey} from '../../key'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: {
        default: "stuff"
      },
      icon: 'http://bit.ly/2fW8bgt'
    }
  }

  componentDidMount() {
    $.ajax(`https://api.darksky.net/forecast/${apiKey}/43.5446,-96.7311`, {
      dataType: "jsonp"
    })
    .then((data) => {
      let icon = this.state.icon
      // http://bit.ly/2glGXR6 cloudy
      if (data.currently.icon === 'cloudy') {
        icon = 'http://bit.ly/2glGXR6'
      }

      this.setState({
        data,
        icon
      })
    })
  }

  render() {
    return (
      <div>
        <img src={this.state.icon}></img>
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
