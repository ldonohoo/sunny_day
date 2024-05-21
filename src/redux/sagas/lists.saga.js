import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


function* getLists() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get('/api/lists', config);
    console.log('Lists GETed:', response.data)
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
    yield put({ type: 'GET_LISTS' });
  } 
  catch (error) {
    console.log('Error getting lists for user:', error);
  }
}

function* updateListOrder(action) {
  try {
    yield axios({
      method: 'PUT',
      url: '/api/lists/sort',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: action.payload
    })
    yield put({ type: 'GET_LISTS' })
  }
  catch(error) {
    console.log('Error updating sort order for lists:', error);
  }
}

function* getListItems(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get(`/api/list_items/${action.payload.list_id}`, config);
    console.log('GET of data from list_items', response.data)
    yield put({ type: 'SET_LIST_ITEMS',
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
    console.log('to choose from:', action.payload)
    yield put({ type: 'GET_LIST_ITEMS',
                payload: {list_id: action.payload.newItem.listId }});
  } 
  catch (error) {
    console.log('Error getting list items for user:', error);
  }
}

function* listSagas() {
  yield takeLatest('GET_LISTS', getLists);
  yield takeLatest('ADD_LIST', addList);
  yield takeLatest('GET_LIST_ITEMS', getListItems);
  yield takeLatest('ADD_LIST_ITEM', addListItem);
  yield takeLatest('UPDATE_LIST_ORDER', updateListOrder);
}

export default listSagas;