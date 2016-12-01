import React from 'react'

export default class InputForm extends React.Component {
  constructor(props) {
    super(props)
    this.submitForm = this.submitForm.bind(this)
  }

  submitForm(e) {
    e.preventDefault()
    let address = this.refs.input.value.split(',')
    address.pop()
    address = address.join()
    this.refs.input.blur()
    this.props.handleSubmit(address)
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <input id="search" value={this.props.address} onChange={this.props.handleChange} ref="input" type='text' placeholder='City, ST'/>
        {false ? <img className="gps" src="/gps.png" onClick={this.props.currentLocation} /> : ''}
      </form>
    )
  }
}

InputForm.propTypes = {
  address: React.PropTypes.string,
  currentLocation: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired
}
