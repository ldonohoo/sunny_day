import { useMemo } from 'react';
// import {  useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
// import Map from '../App/Map/Map';


export default function FindLocation() {
    console.log('env var', import.meta.env.VITE_GOOGLE_MAP_API_KEY);
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    });

    if (!isLoaded) { 
        return <div>Loading...</div>
    } else {
    return (

        <Map />

    )}
}

function Map() {
    return (

        <GoogleMap zoom={10}
                   center={{lat: 44, lng: -80}}
                   mapContainerClassName="map-container">           
        </GoogleMap>
    )
    
}

