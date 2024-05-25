
const timeOfDayReducer = (state = {}, action) => {
    console.log('In time of days reducer, setting time of day types', action.payload)
    if (action.type === 'SET_TIME_OF_DAYS') {
        return action.payload;
    }
    return state; 
};


export default timeOfDayReducer;

