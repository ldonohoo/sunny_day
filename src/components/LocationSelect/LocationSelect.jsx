import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../LocationSelect/LocationSelect.css';

function LocationSelect({isMasterLocation, listId }) {

  // When called from Lists component, edit the master
  //    location on the locations table by user
  // When called from the ListItems component, edit the
  //    location  on the list table 
  //    for a specific list and user 
  //    (pass the current list location down to locations component from
  //     listItems component)


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
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);
    const [selectedLocation, setSelectedLocation] = useState(0);

    // if (isMasterLocation) {
    //     const masterDefaultLoc = useSelector(store => store.masterLocation);
    //     setSelectedLocaation(masterDefaultLoc);
    // } else {a

    // }

  useEffect(() => {
    dispatch({ type: 'GET_LOCATIONS' });
    // if (!isMasterLocation) {
    //   console.log('not a master loc!')
    //   dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
    //              payload: { listId: listId }});
    // }
  }, []);  

  const handleListLocationSelect = (event) => {
    setSelectedLocation(event.target.value);
    console.log('ismaster:', isMasterLocation)
    if (isMasterLocation) {
        // dispatch({
        //     type: 'UPDATE_MASTER_LOCATION',
        //     payload: { locationId: event.target.value }
        // })   
    } else {
      dispatch({
          type: 'UPDATE_CURRENT_LIST_LOCATION',
          payload: { locationId: event.target.value,
                     listId: listId } 
      })
    }
  };
  const handleLocationSelect = (event) => {
    setSelectedLocation(event.target.value);
    console.log('ismaster:', isMasterLocation)
    if (isMasterLocation) {
        // dispatch({
        //     type: 'UPDATE_MASTER_LOCATION',
        //     payload: { locationId: event.target.value }
        // })   
    } else {
      dispatch({
          type: 'UPDATE_CURRENT_LIST_LOCATION',
          payload: { locationId: event.target.value,
                     listId: listId } 
      })
    }
  };


  return (
    <div className="location-select-add">
        <label>{isMasterLocation ? 'DEFAULT LOCATION': 'LIST LOCATION'}</label>
        <select name="selectedLocation"
                value={ isMasterLocation && 
                        locations[0]?.is_master_default_location === true ?
                        locations[0]?.id : ( !isMasterLocation ? selectedLocation : 0 ) }
                onChange={handleLocationSelect}
            ><option value="0">none selected</option>{locations.map(location =>(
            <option key={location.id}
                    value={location.id}
                    name={location.name}>{location.name}
            </option>
        ))}
        </select>
    </div>
  )
}

export default LocationSelect;
