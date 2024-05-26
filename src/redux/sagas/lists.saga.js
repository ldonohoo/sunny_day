import { put, take, takeLatest } from 'redux-saga/effects';
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

function* updateList(action) {
  console.log('actionpayload in updateList:', action.payload.changeShowOnOpen);
  try {
    yield axios({
      method: 'PUT',
      url: `/api/lists/update/${action.payload.listId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: { description: action.payload.description,
              changeShowOnOpen: action.payload.changeShowOnOpen }    
    })
    yield put({ type: 'GET_LISTS' });
  }
  catch(error) {
    console.log('Error in update list', error);
  }
}

function* deleteList(action) {
  try {
    console.log('actionpayload:', action.payload)
    yield axios({
      method: 'DELETE',
      url: `/api/lists/${action.payload.listId}`,
      header: {'Content-Type': 'application/json' },
      withCredentials: true
    })
    yield put({ type: 'GET_LISTS' });
  }
  catch(error) {
    console.log('Error in delete list', error);
  }
}

function* copyList(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.post('/api/lists/copy',  action.payload, config);
    yield put({ type: 'GET_LISTS' });
  } 
  catch (error) {
    console.log('Error getting lists for user:', error);
  }
}


function* updateListOrder(action) {
  console.log('in updateListOrder! action.payload:', action.payload)
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
/**
 * Get List Items
 *  path params: list id
 *  query params: showCompleted (boolean)
 *                group (week/day/month groupBy selection)
 */
function* getListItems(action) {
  console.log('in getlistitems', action.payload)
  try {
    const listId = action.payload.listId;
    const group = action.payload.group;
    const response = yield axios({
      method: 'GET',
      url: `/api/list_items/${listId}?group=${group}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
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
                payload: {listId: action.payload.newItem.listId,
                          group: action.payload.newItem.group }});
  } 
  catch (error) {
    console.log('Error getting list items for user:', error);
  }
}

function* updateListItem(action) {
  const changeItem = action.payload.changeItem;
  try {
    yield axios({
      method: 'PUT',
      url: `/api/list_items/edit/${changeItem.listItemId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: changeItem
    })
    yield put({ type: 'GET_LIST_ITEMS',
                payload: { listId: changeItem.listId,
                           group: changeItem.group }
     });
  }
  catch(error) {
    console.log('Error in update list item', error);
  }
}

function* updateListItemDescription(action) {
  console.log('update list item action.payload', action.payload)
  try {
    yield axios({
      method: 'PUT',
      url: `/api/list_items/update_desc/${action.payload.listItemId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: {description: action.payload.description}
    })
    yield put({ type: 'GET_LIST_ITEMS',
                payload: { listId: action.payload.listId,
                           group: action.payload.group }
     });
  }
  catch(error) {
    console.log('Error in update of list item description', error);
  }
}


function* toggleCompleteListItem(action) {
  console.log('in toggle, listId: ', action.payload.listId)
  try {
    yield axios({
      method: 'PUT',
      url: `/api/list_items/toggle_complete/${action.payload.listItemId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    yield put({ type: 'GET_LIST_ITEMS',
                payload: { listId: action.payload.listId,
                           group: action.payload.group }
     });
  }
  catch(error) {
    console.log('Error in toggle complete of list item', error);
  }
}

function* deleteListItem(action) {
  try {
    console.log('actionpayload:', action.payload)
    yield axios({
      method: 'DELETE',
      url: `/api/list_items/${action.payload.listItemId}`,
      header: {'Content-Type': 'application/json' },
      withCredentials: true
    })
    console.log('here!');
    yield put({ type: 'GET_LIST_ITEMS',
                listId: action.payload.listItemId,
                group: action.payload.group });
  }
  catch(error) {
    console.log('Error in delete list item', error);
  }
}

function* updateListItemsOrder(action) {
  console.log('in updateListItemsOrder! action.payload:', action.payload)
  try {
    yield axios({
      method: 'PUT',
      url: `/api/list_items/sort/${action.payload.listId}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: { indexToMove: action.payload.indexToMove,
              indexToReplace: action.payload.indexToReplace }
      });
    yield put({ type: 'GET_LIST_ITEMS',
                payload: { listId: action.payload.listId,
                           group: action.payload.group }
     });
  }
  catch(error) {
    console.log('Error updating sort order for lists:', error);
  }
}



function* listSagas() {
  yield takeLatest('GET_LISTS', getLists);
  yield takeLatest('ADD_LIST', addList);
  yield takeLatest('UPDATE_LIST', updateList);
  yield takeLatest('DELETE_LIST', deleteList);
  yield takeLatest('COPY_LIST', copyList);
  yield takeLatest('UPDATE_LIST_ORDER', updateListOrder);
  yield takeLatest('GET_LIST_ITEMS', getListItems);
  yield takeLatest('ADD_LIST_ITEM', addListItem);
  yield takeLatest('UPDATE_LIST_ITEM', updateListItem);
  yield takeLatest('UPDATE_LIST_ITEM_DESCRIPTION', updateListItemDescription);
  yield takeLatest('TOGGLE_COMPLETE_LIST_ITEM', toggleCompleteListItem);
  yield takeLatest('DELETE_LIST_ITEM', deleteListItem);
  yield takeLatest('UPDATE_LIST_ITEMS_ORDER', updateListItemsOrder);

}

export default listSagas;