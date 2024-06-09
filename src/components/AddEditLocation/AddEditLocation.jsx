// import { Loader } from "@googlemaps/js-api-loader"
// import { GoogleMap, LoadScript } from '@react-google-maps/api';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
// import MapBox from '../MapBox/MapBox';
import './AddEditLocation.css';

function AddEditLocation() {

  const dispatch = useDispatch();
  const autoCompleteResults = 
    useSelector(state => state.locationsReducer.autoCompleteResults);
  const locations = 
    useSelector(store => store.locationsReducer.locations);
  const [inputLocation, setInputLocation] = useState('');
  

  useEffect(() => {
    dispatch({ type: 'GET_LOCATIONS' });
  }, [])

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setInputLocation(newLocation);
    if (newLocation.length > 2) {
      dispatch({
        type: 'GET_GOOGLE_LOCATION_AUTOCOMPLETE',
        payload:  { locString: newLocation }
      })
    }
  }

  const handleLocationSelect = (placeId) => {
    dispatch({
      type: 'GET_GOOGLE_LOCATION_DETAILS',
      payload: { placeId: placeId }
    })
    setInputLocation('');
  }

  const handleLocationRemove = (locationId) => {
    dispatch({
      type: 'DELETE_LOCATION',
      payload: { locationId: locationId }
    })
  }

  return (
    <section className="location-add-edit-section">
      <article className="location-add-edit-select">
        <h3 className="med-font font-weight-lt">FIND LOCATION</h3>
        <input className="input-new-location"
              type="text"
              value={inputLocation}
              onChange={handleLocationChange}
              placeholder="Enter city & state, zip, place..."/>
      {autoCompleteResults?.length > 0 && (
        <ul className="location-add-edit-select-list">
          {autoCompleteResults?.map((result) => (
            <li key={result.place_id}><span>{result.description}</span><button onClick={() => handleLocationSelect(result.place_id)}>+</button></li>
          ))}
        </ul>
      )}
      </article>
      <article className="current-locations">
        <ul className="current-locations-list">
          <h3 className="med-font font-weight-lt">YOUR LOCATIONS</h3>
          {locations.map((location => (
            <li key={location.id}><span>{location.name}</span><button onClick={() => handleLocationRemove(location.id)}>🗑️</button></li>
          )))}
        </ul>
      </article>
    </section>
    )
}

export default AddEditLocation;


