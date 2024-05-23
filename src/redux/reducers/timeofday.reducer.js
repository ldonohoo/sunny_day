import { combineReducers } from 'redux';

// loginMessage holds the string that will display
// on the login screen if there's an error
const timeOfDays = (state = [], action) => {
    console.log('setting time of day types', action.payload)
    if (action.type === 'SET_TIME_OF_DAYS') {
        return action.payload;
    }
    return state; 
};


// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  timeOfDays,
});
