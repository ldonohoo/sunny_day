import { combineReducers } from 'redux';

// loginMessage holds the string that will display
// on the login screen if there's an error
const weatherTypes = (state = [], action) => {
    switch (action.type) {}
    if (action.type === 'SET_WEATHER_TYPES') {
        return action.payload;
    }
    return state; 
};


// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  weatherTypes,
});
