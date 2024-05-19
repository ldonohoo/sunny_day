import { combineReducers } from 'redux';

// loginMessage holds the string that will display
// on the login screen if there's an error
const setLocations = (state = [], action) => {
    switch (action.type) {}
    if (action.type === 'SET_LOCATIONS') {
        return action.payload;
    }
    return state; 
};

const setMasterLocation = (state=0, action) => {
  if (action.type === 'SET_MASTER_LOCATION') {
    return action.payload;
  }
  return state;
}

const setCurrentListLocation= (state=0, action) => {
  if (action.type === 'SET_CURRENT_LIST_LOCATION') {
    return action.payload;
  }
  return state;
}


// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  setLocations,
  setMasterLocation,
  setCurrentListLocation
});
