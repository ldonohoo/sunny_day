import React from 'react';
import { GoogleMap, LoadScript, useJsApiLoader} from '@react-google-maps/api';

function MapBox() {

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
    console.log(googleMapsApiKey);
    const containerStyle = {
        width: '50%',
        height: '200px'
    };

    const center = {
        lat: -3.745,
        lng: -38.523
    }

    function MyComponent() {


        const [map, setMap] = React.useState(null)

        useEffect(() => {
            const bounds = new window.google.maps.LatLngBounds(center);
            map.fitBounds(bounds);
        
            setMap(map)

            return () => {
                setMap(null);
            };
    }, [])
        // const onLoad = React.useCallback(function callback(map) {
        //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
        //   const bounds = new window.google.maps.LatLngBounds(center);
        //   map.fitBounds(bounds);
      
        //   setMap(map)
        // }, [])
      

        useEffect(() => {
            const { isLoaded } = useJsApiLoader({
                id: 'google-map-script',
                googleMapsApiKey: googleMapsApiKey
              })
            
        }, [])


        return isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              { /* Child components, such as markers, info windows, etc. */ }
              <></>
            </GoogleMap>
        ) : <></>
      }
    // let map;

    // async function initMap() {
    // const { Map } = await google.maps.importLibrary("maps");

    // map = new Map(document.getElementById("map"), {
    //     center: { lat: -34.397, lng: 150.644 },
    //     zoom: 8,
    // });
    // }

// initMap();


    // return (

    //     <LoadScript googleMapsApiKey={googleMapsApiKey}>
    //         <GoogleMap mapContainerStyle={containerStyle}
    //                    center={center}
    //                    zoom={10}>
    //            <AdvancedMarkerElement position={center} />     
    //         </GoogleMap>
    //     </LoadScript>
    // )
    
}

export default MapBox;