import style from './enouvo-train.scss';
import { EnouvoTrain } from './EnouvoTrain';
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
    zoom: 14,
    center: mapLatLng,
    disableDefaultUI: true,
    styles: styleMap
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  map.setOptions({ styles: styleMap });

  const eventsMap = {
    human_train: function(message) {
      console.log(message);
    }
  };

  const enouvoTrain = new EnouvoTrain({ map: map, events: eventsMap });

  const dataTrains = [
    {
      latlng: { lat: -31.9546781, lng: 115.852662 },
      data: {
        name: 'ABC123',
        list: [{ name: 'TrainNo', value: 'abc456' }]
      }
    },
    {
      latlng: { lat: -31.9546781, lng: 115.856662 },
      data: {
        name: 'ABC456',
        list: [{ name: 'TrainNo', value: 'abc456' }]
      }
    },
    {
      latlng: { lat: -31.9546781, lng: 115.858662 },
      data: {
        name: 'ABC789',
        list: [{ name: 'TrainNo', value: 'abc456' }]
      }
    }
  ];
  const dataLines = [{ data: { abc: 123 } }];

  enouvoTrain.createTrainsInit(dataTrains);
  enouvoTrain.createLinesInit(dataLines);
}

google.maps.event.addDomListener(window, 'load', initialize);
