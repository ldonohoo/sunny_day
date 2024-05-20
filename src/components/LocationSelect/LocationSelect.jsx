import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function LocationSelect({isMasterLocation, listId }) {

    //  lists screen: dispatch/update to location table
    //  list items screen: dispatch/update to list table

    //if we are showing this on the lists screen,
    // the master default location for that user should show,
    // if any so we need to pull the specific master default
    // location from the location table with userid = blah 
    // and see if a record exists with is_master on

    // if we are showing this on the list items screen,
    // we need to get the location from the list number
    // and update that if it changes
    const dispatch = useDispatch();
    const locations = 
      useSelector(store => store.locationsReducer.locations);
    const currentListLocation = 
      useSelector(store => store.locationsReducer.currentListLocation);
    const [selectedLocation, setSelectedLocation] = useState(0);

    // if (isMasterLocation) {
    //     const masterDefaultLoc = useSelector(store => store.masterLocation);
    //     setSelectedLocaation(masterDefaultLoc);
    // } else {a

    // }

  useEffect(() => {
    dispatch({ type: 'GET_LOCATIONS' });
  }, []);  

  if (isMasterLocation) {
    useEffect(() => {
      if (locations && 
          locations.length > 0 && 
          locations[0].is_master_default_location === true) {
            setSelectedLocation(locations[0].id);
      }
    }, [locations]);
  }

  if (!isMasterLocation) {
    useEffect(() => {
      dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
                 payload: {locationId: selectedLocation,
                           listId: listId }});
    }, [selectedLocation])
  }

  const handleLocationSelect = (event) => {
    setSelectedLocation(event.target.value);
    console.log('ismaster:', isMasterLocation)
    if (isMasterLocation) {
        dispatch({
            type: 'UPDATE_MASTER_LOCATION',
            payload: { locationId: event.target.value }
        })   
    } else {
      dispatch({
          type: 'UPDATE_CURRENT_LIST_LOCATION',
          payload: { locationId: event.target.value,
                     listId: listId } 
      })
    }
  };

  return (
    <div>
        <label>{isMasterLocation ? 'default location': 'list location'}</label>
        <select name="selectedLocation"
                value={selectedLocation}
                onChange={handleLocationSelect}
            ><option value="0">none selected</option>{locations.map(location =>(
            <option key={location.id}
                    value={location.id}
                    name={location.name}>{location.name}::{location.id}
            </option>
        ))}
        </select>
    </div>
  )
}

export default LocationSelect;
