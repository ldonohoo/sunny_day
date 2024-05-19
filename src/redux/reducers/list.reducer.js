import { combineReducers } from 'redux';

// loginMessage holds the string that will display
// on the login screen if there's an error
const lists = (state = [], action) => {
    console.log('actionpayload', action.payload)
    if (action.type === 'SET_LISTS') {
        return action.payload;
    }
    return state; 
};

const listItems = (state = [], action) => {
  console.log('actionpayload', action.payload)
  if (action.type === 'SET_LIST_ITEMS') {
      return action.payload;
  }
  return state; 
};



// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  lists,
  listItems
});
