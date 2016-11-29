import React from 'react'
import {Day} from './Day'

export const Details = (props) => {
  return (
    <div className="details">
      <div className="today">
        <p className="summary">{props.summary}</p>
        <p className="temp">{props.temp}&#8457;</p>
        <p className="city">{props.address}</p>
      </div>
      <div className="daily">
      <span>Next 7 days</span>
      {props.daily.data.map((day, i) => {
        if (i == 0) return
        return <Day key={day.time} day={day}/>
      })}
      </div>
    </div>
  )
}

React.propTypes = {
  address: React.PropTypes.string.isRequired,
  daily: React.PropTypes.object.isRequired,
  summary: React.PropTypes.string.isRequired,
  temp: React.PropTypes.string.isRequired
}
