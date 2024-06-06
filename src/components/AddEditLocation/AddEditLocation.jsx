// import { Loader } from "@googlemaps/js-api-loader"
// import { GoogleMap, LoadScript } from '@react-google-maps/api';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

function AddEditLocation() {

  const [location, setLocation] = useState({ lat: 41.3851, long: 2.1734 });
  // const googleMapData = useSelector(store => store.locationReducer.googleMapData);
  const mapStyles = {
    height: '100vh',
    width: '100%',
  };  
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  console.log('apikeyhere:', googleMapsApiKey);
  const position = {lat: 53.54992, lng: 10.00678};
//   const {isLoaded} = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
//   });
//   if (!isLoaded) { 
//     return <div>Loading...</div>
// } else {
  return (
  //   <APIProvider apiKey={API_KEY}>
  //   <Map
  //     defaultZoom={3}
  //     defaultCenter={{lat: 22.54992, lng: 0}}
  //     gestureHandling={'greedy'}
  //     disableDefaultUI={true}
  //   />
  //   <ControlPanel />
  // </APIProvider>



    <APIProvider apiKey={googleMapsApiKey}>
      <Map defaultCenter={position} defaultZoom={10}
              gestureHandling={'greedy'}
              disableDefaultUI={true}>
      </Map>
    </APIProvider>
  );
};

export default AddEditLocation;


