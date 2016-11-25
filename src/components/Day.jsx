import React from 'react'

export const Day = (props) => {
  let {day} = props
  let date = new Date(day.time * 1000)
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let weekday = days[date.getDay()]

  return (
    <div className="days">
      <p>{weekday}</p>
      <p>{Math.round(day.temperatureMax).toFixed(0)}&#8457;</p>
      <p>{day.summary}</p>
    </div>
  )
}
