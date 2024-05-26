import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


function* getWeatherTypes() {
    console.log('in get weather types')
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get('/api/weather/types', config);
    console.log('weather types:',response.data);
    yield put({ type: 'SET_WEATHER_TYPES', payload: response.data });
  } 
  catch (error) {
    console.log('Error getting weather types:', error);
  }
}

function* getWeatherForecast(action) {
  console.log('In get of weather forecast, payload:', action.payload);
try {
  const response = yield axios({
    method: 'GET',
    url: `/api/weather/forecast/?id=${action.payload.id}`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  })
  console.log('Weather forecast data!!!!', response.data);
  yield put({ type: 'SET_WEATHER_FORECAST', payload: response.data });
} 
catch (error) {
  console.log('Error getting weather forecast:', error);
}
}

function* locationSagas() {
  yield takeLatest('GET_WEATHER_TYPES', getWeatherTypes);
  yield takeLatest('GET_WEATHER_FORECAST', getWeatherForecast);
}

export default locationSagas;
