import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


function* getTimeOfDays() {
    console.log('in get time of day types')
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get('/api/time_of_days', config);
    console.log('WOWSER time of day get done, about to set', response.data);
    yield put({ type: 'SET_TIME_OF_DAYS', payload: response.data });
  } 
  catch (error) {
    console.log('WOWSER Error getting time of day types:', error);
  }
}


function* timeOfDaySagas() {
  yield takeLatest('GET_TIME_OF_DAYS', getTimeOfDays);
}

export default timeOfDaySagas;
