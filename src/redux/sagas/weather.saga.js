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
    yield put({ type: 'SET_WEATHER_TYPES', payload: response.data });
  } 
  catch (error) {
    console.log('Error getting weather types:', error);
  }
}


function* locationSagas() {
  yield takeLatest('GET_WEATHER_TYPES', getWeatherTypes);
}

export default locationSagas;
