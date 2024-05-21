import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function WeatherForecast({listId}) {

    const dispatch = useDispatch();
    const currentListLocation = 
      useSelector(store => store.locationsReducer.currentListLocation);
    const weatherForecast = 
      useSelector(store => store.weatherReducer.weatherForecast);

  useEffect(() => {
    const getData = async () => {
        await dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
                         payload: {listId: listId}});
        console.log('current list loc', JSON.stringify(currentListLocation));
        await dispatch({ type: 'GET_WEATHER_FORECAST',
                         payload: currentListLocation });
    }
    getData();

  }, []);

  return (
    <div>{JSON.stringify(currentListLocation)}
            :::{JSON.stringify(weatherForecast)}
        <label>Current Forecast</label>

    </div>
  )
}

export default WeatherForecast;