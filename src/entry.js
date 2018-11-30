
import { TrainAsset, StationAsset } from './assets';
import style from './enouvo-train.scss';

function initialize() {
    var mapLatLng = new google.maps.LatLng(-31.9546781, 115.852662);
    var mapOptions = {
        zoom: 14,
        center: mapLatLng,
        disableDefaultUI: true
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);


    var trainLatLng = new google.maps.LatLng(-31.9546781, 115.852662);
    let marker = new TrainAsset({
        latlng: trainLatLng,
        map: map,
        data: {
            name: 'abc'
        }
    });

    var stationLatLng = new google.maps.LatLng(-31.9546781, 115.862662);
    let station = new StationAsset({
        latlng: stationLatLng,
        map: map,
        data: {
            name: 'abc'
        }
    });

}
google.maps.event.addDomListener(window, 'load', initialize);