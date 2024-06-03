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
    console.log('weather types..', response.data);
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
    console.log('Error getting weather types:', error);
  }
}

/**
 * Create recommendataions 
 *   - issues a request for recommendations from an
 *    openAI chat complete endpoint
 *   - creates new recommendations in the recommendations table

 */
function* createRecommendations(action) {
  console.log('In get/create of recommendations from openAI, payload:', action.payload.listId);
  try {
    const response = yield axios({
      method: 'GET',
      url: `/api/weather/recommendations/${action.payload.listId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    console.log('Recommendations are in the database!!!!');
    yield put({ type: 'GET_RECOMMENDATIONS', 
                payload: { listId: action.payload.listId } });
  } 
  catch (error) {
    console.log('Error getting recommendations:', error);
  }
}

function* getRecommendations(action) {
  console.log('In get of recommendations from table, payload:', action.payload.listId);
  try {
    const response = yield axios({
      method: 'GET',
      url: `/api/weather/get_recommendation_text/${action.payload.listId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    console.log('Recommendations!!!!', response.data);
    yield put({ type: 'SET_RECOMMENDATIONS', payload: response.data });
  } 
  catch (error) {
    console.log('Error getting weather types:', error);
  }
}

function* locationSagas() {
  yield takeLatest('GET_WEATHER_TYPES', getWeatherTypes);
  yield takeLatest('GET_WEATHER_FORECAST', getWeatherForecast);
  yield takeLatest('CREATE_RECOMMENDATIONS', createRecommendations);
  yield takeLatest('GET_RECOMMENDATIONS', getRecommendations);
}

export default locationSagas;
