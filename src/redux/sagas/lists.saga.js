import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


function* fetchLists() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get('/api/lists', config);
    console.log('hey wallaby', response.data)
    yield put({ type: 'SET_LISTS',
                payload: response.data });
  } 
  catch (error) {
    console.log('Error getting lists for user:', error);
  }
}

function* addList(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.post('/api/lists',  action.payload, config);
    yield put({ type: 'FETCH_LISTS' });
  } 
  catch (error) {
    console.log('Error getting lists for user:', error);
  }
}

function* fetchListItems(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get(`/api/lists_items/${action.payload}`, config);
    console.log('Fetch of data from list_items', response.data)
    yield put({ type: 'SET_LIST_items',
                payload: response.data });
  } 
  catch (error) {
    console.log('Error getting lists for user:', error);
  }
}

function* addListItem(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.post('/api/list_items',  action.payload, config);
    yield put({ type: 'FETCH_LIST_ITEMS' });
  } 
  catch (error) {
    console.log('Error getting list items for user:', error);
  }
}

function* listSagas() {
  yield takeLatest('FETCH_LISTS', fetchLists);
  yield takeLatest('ADD_LIST', addList);
  yield takeLatest('FETCH_LIST_ITEMS', fetchListItems);
  yield takeLatest('ADD_LIST_ITEM', addListItem);
}

export default listSagas;