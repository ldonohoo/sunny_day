import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


function* getMasterLocation() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.get('/api/locaton/master', config);
    yield put({ type: 'SET_MASTER_LOCATION' });
  } 
  catch (error) {
    console.log('Error getting master location:', error);
  }
}

function* getCurrentListLocation() {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
      yield axios.get('/api/locaton/current_list', config);
      yield put({ type: 'SET_CURRENT_LIST_LOCATION' });
    } 
    catch (error) {
      console.log('Error getting current list location:', error);
    }
  }


function* locationSagas() {
  yield takeLatest('GET_MASTER_LOCATION', getMasterLocation);
  yield takeLatest('GET_CURRENT_LIST_LOCATION', getCurrentListLocation);
}

export default locationSagas;
