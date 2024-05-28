import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './WeatherForecast.css';


function WeatherForecast({listId}) {

    const dispatch = useDispatch();
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);
    const weatherForecast = 
      useSelector(store => store.weatherReducer.weatherForecast);
    const [noLocation, setNoLocation] = useState(true);
    const [errorFetchingForecast, setErrorFetchingForecast] = useState(false);

  useEffect(() => {
    console.log('currentLoc:', currentLocation);
    if (currentLocation !== 0) {
      setNoLocation(false);
      try {
        // dispatch({ type: 'GET_WEATHER_FORECAST',
        //         payload: currentLocation[0] });
      }
      catch(error) {
        console.log('Error fetching forecast, please try again later');
        setErrorFetchingForecast(true);
      }
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
      {!noLocation ? 'Select Location to see forecast' :
          (errorFetchingForecast ? 'Error Fetching Forecast data, try again later.' :
        ( 
          <>
          <h4 className="weather-overview">7 Day Forecast:<span>{weatherForecast.description}</span></h4> 
          <section className="weather-forecast">
            {weatherForecast.days?.map(day => (
              <figure className="forecast-box" 
                    key={day?.datetime}>
                <h5>{getDayOfWeek(day?.datetime)}</h5>
                <p>MIN {day.tempmin}°F (feels<br/>like {day.feelslikemin}°F)</p>
                <p>MAX {day.tempmax}°F (feels<br/>like {day.feelslikemax}°F)</p>
                <img src={getIcon(day.icon)} alt={day.description}/>
                <figcaption>{day.description}</figcaption>
                <p>{day.precipprob}%, {day.precip} in</p>
              </figure>
            ))}
          </section>
          </>
        ))
      }
    </>
  )
}


export default WeatherForecast;