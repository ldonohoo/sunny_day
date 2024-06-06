import { put, take, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getLocations() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    console.log('whoa! in getlocations saga')
    const response = yield axios.get('/api/locations', config);
    yield put({ type: 'SET_LOCATIONS', payload: response.data });
  }
  catch (error) {
    console.log('Get of all possible locations for user failed:', error);
  }
}

function* getMasterLocation() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get('/api/locations/master', config);
    console.log('getmastlocsaga:',response.data);
    yield put({ type: 'SET_LOCATIONS', payload: response.data });
  } 
  catch (error) {
    console.log('Error getting master location:', error);
  }
}

function* getCurrentListLocation(action) {
    try {

      console.log('getcurrenloc', action.payload, 'asdf', action.payload.listId);
      const response = 
        yield axios({
          method: 'GET',
          url: `/api/locations/current_list/${action.payload.listId}`,
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        console.log('response.data from getcurrentlistloc', response.data)
      yield put({ type: 'SET_CURRENT_LIST_LOCATION', payload: response.data });
    } 
    catch (error) {
      console.log('Error getting current list location:', error);
    }
  }

  function* updateMasterLocation(action) {
    try {
      const response = yield axios({
        method: 'PUT',
        url: '/api/locations/master',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: action.payload
      })
      yield put({ type: 'GET_LOCATIONS', payload: action.payload });
    } 
    catch (error) {
      console.log('Error getting master location:', error);
    }
  }
  
  function* updateCurrentListLocation(action) {
      try {
        console.log(action.payload);
        yield axios({
          method: 'PUT',
          url: `/api/locations/current_list/${action.payload.listId}`,
          // let the Passport middleware know we're sending JSON 
          headers: { 'Content-Type': 'application/json' },
          // send user credentials up 
          withCredentials: true,
          data: { locationId: action.payload.locationId }
        })
        console.log('put done, calling get with payload', action.payload);
        yield put({ type: 'GET_CURRENT_LIST_LOCATION', 
                    payload: { listId: action.payload.listId }});
      } 
      catch (error) {
        console.log('Error updating current list location:', error);
      }
    }

    function* getGoogleMapData(action) {
      try {
        response = yield axios({
          method: 'GET',
          url: `/api/locations/map/$lat=${action.payload.lat}&long=${action.payload.long}`
        })
        console.log('Get of google map data successful!', response.data);
        yield put({
          type: 'SET_GOOGLE_MAP_DATA',
          payload: response.data
        })
      } catch(error) {
        console.log('Error in get of google map data')
      }
    }

function* locationSagas() {
  yield takeLatest('GET_LOCATIONS', getLocations);
  yield takeLatest('GET_MASTER_LOCATION', getMasterLocation);
  yield takeLatest('GET_CURRENT_LIST_LOCATION', getCurrentListLocation);
  yield takeLatest('UPDATE_MASTER_LOCATION', updateMasterLocation);
  yield takeLatest('UPDATE_CURRENT_LIST_LOCATION', updateCurrentListLocation);
  yield takeLatest('GET_GOOGLE_MAP_DATA', getGoogleMapData);
}

export default locationSagas;
