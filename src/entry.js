import { TrainAsset, StationAsset, InfoWindow, TrainTooltip } from './assets';
import style from './enouvo-train.scss';

var styleMap = [
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
];
function initialize() {
  if (typeof google === 'undefined') {
    console.warn('Google Maps is not defined!');
    return;
  }

  var mapLatLng = new google.maps.LatLng(-31.9546781, 115.852662);
  var mapOptions = {
    zoom: 15,
    center: mapLatLng,
    disableDefaultUI: true,
    // streetViewControl: true,
    styles: styleMap
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  console.log(styleMap);
  map.setOptions({ styles: styleMap });

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
