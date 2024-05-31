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
        dispatch({ type: 'GET_WEATHER_FORECAST',
                payload: currentLocation[0] });
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
                {/* {'::::' + JSON.stringify(weatherForecast) + '::::'} 
                {'********' + JSON.stringify(weatherForecast + '*******')} */}
      {noLocation ? 'Select Location to see forecast' :
          (errorFetchingForecast ? 'Error Fetching Forecast data, try again later.' :
        ( 
          <>
          <h4 className="weather-overview md-font">7 DAY FORECAST:<span>{weatherForecast?.description}</span></h4> 
          <section className="weather-forecast">
            {weatherForecast.days?.map(day => (
              <figure className="forecast-card" 
                    key={day?.datetime}>
                <h5 className="forecast-day">{getDayOfWeek(day?.datetime)}</h5>
                <div className="forecast-box">
                <h6 className="forecast-current
                               title
                               temp
                               sm-font">CURRENT</h6>
                  <div className="no-margin-padding">
                    <div className="inline-block">
                      <p className="forecast-current data temp">{weatherForecast.currentConditions?.temp}°F</p>
                    </div>
                    <div className="inline-block small-padding">
                      <h6 className="forecast-current
                                     title
                                     feelslike
                                     inline-block">FEELS<br/>LIKE</h6> 
                      <p className="forecast-current
                                    data
                                    feelslike
                                    inline-block">{weatherForecast.current?.feelslike}°F</p>
                    </div>
                  </div>
                  <div>
                  <h6 className="forecast-daily
                               title
                               temp
                               sm-font">DAILY</h6>
                    <div className="inline-block
                                    small-padding">
                      <h6 className="forecast-daily
                                     title
                                     high">HIGH</h6>
                      <p className="forecast-daily data high med-font">{day?.tempmax}°F</p>
                    </div>
                    {/* <div className="inline-block">
                      <h6 className="forecast-daily title feels-high ">FEELS<br/>LIKE</h6>
                      <p className="forecast-daily data feels-high">{day.feelslikemax}°F</p>
                    </div> */}
                    <div className="inline-block small-padding">
                      <h6 className="forecast-daily
                                     title
                                     low">LOW</h6>
                      <p className="forecast-daily data low med-font">{day?.tempmin}°F</p>
                    </div>
                    {/* <div className="inline-block">
                      <h6 className="forecast-daily title feels-low">FEELS<br/>LIKE</h6>
                      <p className="forecast-daily data feels-low">{day.feelslikemin}°F</p>
                    </div> */}
                  </div>
                  <img className="forecast-daily-img"src={`../../../images/${day?.icon}.svg`} width="50px" height="50px" alt={day.description}/>
                  <figcaption className="forecast-daily desc">{day?.description}</figcaption>
                  <h6 className="forecast-daily title precip">PRECIPITATION TODAY</h6>
                  <div className="inline-block">
                    <p className="forecast-daily
                                  data precip-percent
                                  inline-block 
                                  small-padding
                                  med-font">{day?.precipprob}%</p>
                    <p className="forecast-daily
                                  data
                                  precip-amount 
                                  inline-block 
                                  small-padding
                                  med-font">{day?.precip} in</p>
                  </div>
                </div>
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