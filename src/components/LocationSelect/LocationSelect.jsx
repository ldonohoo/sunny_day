import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function LocationSelect({isMasterLocation}) {

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

    const [selectedLocation, setSelectedLocaation] = useState('');
    const locations = useSelector(store => store.locations);
    if (isMasterLocation) {
        const masterDefaultLoc = useSelector(store => store.masterLocation);
        setSelectedLocaation(masterDefaultLoc);
    } else {
        const listLoc = useSelector(store => store.currentListLocation);
       setSelectedLocaation(selectedLocation);
    }

  useEffect(() => {
    dispatch({ type: 'GET_LOCATIONS' });
    // if (isMasterLocation) {
    //     dispatch({ type: 'GET_MASTER_LOCATION' });
    // } else {
    //     dispatch({ type: 'GET_CURRENT_LIST_LOCATION' });
    // }
  }, []);


  const handleLocationSelect = (event) => {
    event.preventDefault();
    if (isMasterLocation) {
        dispatch({
            type: 'UPDATE_MASTER_LOCATION',
            payload: { location: selectedLocation }
        })   
    }
    dispatch({
        type: 'UPDATE_CURRENT_LIST_LOCATION',
        payload: { location: selectedLocation }
    })
  };


  return (
    <div>{JSON.stringify(locations)}
        {/* <select value={selectedLocation}
                onChange={handleLocationSelect}
            >{locations.map(location =>{
            <option value={location.id}>
                {location.description}
            </option>
        })}
        </select> */}
    </div>
  )
}

export default LocationSelect;
