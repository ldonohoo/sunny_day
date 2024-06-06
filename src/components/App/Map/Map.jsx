import { GoogleMap, Marker } from '@react-google-maps/api';

function Map() {


    let map;

    async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
    }

initMap();


    return (

        <GoogleMap zoom={10}
                   center={{lat: 44, lng: -80}}
                   mapContainerClassName="map-container">           
        </GoogleMap>
    )
    
}

export default Map;