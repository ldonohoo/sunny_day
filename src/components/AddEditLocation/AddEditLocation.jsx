import { Loader } from "@googlemaps/js-api-loader"
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

function AddEditLocation() {

  const [location, setLocation] = useState({ lat: 41.3851, long: 2.1734 });
  const googleMapData = useSelector(store => store.locationReducer.googleMapData);
  const mapStyles = {
    height: '100vh',
    width: '100%',
  };



  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapStyles}
                 zoom={13}
                 center={location}/>
    </LoadScript>
  );
};

export default AddEditLocation;


