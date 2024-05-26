// import { current } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function WeatherForecast({listId}) {

    const dispatch = useDispatch();
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);
    const weatherForecast = 
      useSelector(store => store.weatherReducer.weatherForecast);
    const [noLocation, setNoLocation] = useState(true);
    // const [forecastDays, setForecastDays] = useState(weatherForecast.days);

  useEffect(() => {
    dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
               payload: {listId: listId}});
  }, []);

  useEffect(() => {
    if (currentLocation !== 0) {
      setNoLocation(false);
      dispatch({ type: 'GET_WEATHER_FORECAST',
               payload: currentLocation });
      // setForecastDays(weatherForecast.days);
    } else {
      setNoLocation(true);
    }
  }, [currentLocation])

  const getDayOfWeek = (dateString) => {
    // turn dateString into a date object
    const date = new Date(dateString);
    // Get the day of the week number
    const dayOfWeekNumber = date.getDay();
    // Map the day number to the day name
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayOfWeekNumber];
  };

  const getIcon = (iconId) => {

  }
 
  
  return (
    <>
                {/* {'::::' + JSON.stringify(weatherForecast) + '::::'}  */}
      {!weatherForecast ? 'Select Location to see forecast' : 
        ( 
          <>
            <h4>7 Day Forecast:<span>{weatherForecast.description}</span></h4> 
            {weatherForecast.days?.map(day => (
              <div>
                <h5>{getDayOfWeek(day?.datetime)}</h5>
                <p>MIN {day.tempmin}°F (feels<br/>like {day.feelslikemin}°F)</p>
                <p>MAX {day.tempmax}°F (feels<br/>like {day.feelslikemax}°F)</p>
                <image src={getIcon(day.icon)} alt={day.description}/>
                <p>{day.description}</p>
                <p>{day.precipprob}%, {day.precip} in</p>
              </div>
            ))}
          </>
        )
      }
    </>
  )
}


export default WeatherForecast;