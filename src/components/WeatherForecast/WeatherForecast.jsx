import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function WeatherForecast({listId}) {

    const dispatch = useDispatch();
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);
    const weatherForecast = 
      useSelector(store => store.weatherReducer.weatherForecast);

  useEffect(() => {
    dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
               payload: {listId: listId}});
  }, []);

  useEffect(() => {
    dispatch({ type: 'GET_WEATHER_FORECAST',
               payload: currentLocation[0] });
  }, [currentLocation])

  return (
    <div>{JSON.stringify(currentLocation)}
            ::::{JSON.stringify(weatherForecast)}::::
    </div>
  )
}

export default WeatherForecast;