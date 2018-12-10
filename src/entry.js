import style from './enouvo-train.scss';
import { EnouvoTrain } from './EnouvoTrain';

function initialize() {
  var map = document.getElementById('map');
  var mapOptions = {
    latLng: { lat: -31.9546781, lng: 115.852662 },
    element: map
  };

  const eventsMap = {
    human_train: function(message) {
      console.log('human_train', message);
    },
    human_station: function(message) {
      console.log('human_station', message);
    },
    human_line: function(message) {
      console.log('human_line', message);
    }
  };

  var enouvoTrain = new EnouvoTrain(mapOptions, { events: eventsMap });

  const dataTrains = [
    {
      latlng: { lat: -31.9546781, lng: 115.852662 },
      data: {
        tdn: 'ABC123',
        name: 'ABC123',
        list: [{ name: 'TrainNo', value: 'ABC123' }]
      }
    },
    {
      latlng: { lat: -31.9546781, lng: 115.856662 },
      data: {
        tdn: 'ABC456',
        name: 'ABC456',
        list: [{ name: 'TrainNo', value: 'ABC456' }]
      }
    },
    {
      latlng: { lat: -31.9566781, lng: 115.856662 },
      data: {
        tdn: 'ABC098',
        name: 'ABC098',
        list: [{ name: 'TrainNo', value: 'ABC098' }]
      }
    }
  ];

  const dataStaions = [
    {
      latlng: { lat: -31.9546781, lng: 115.852662 },
      data: {
        name: 'Station 124'
      }
    },
    {
      latlng: { lat: -31.9546781, lng: 115.856662 },
      data: {
        name: 'Station 890'
      }
    }
  ];

  const dataLines = [{ data: { abc: 123 } }];

  enouvoTrain.createLinesInit(dataLines);
  enouvoTrain.createStationsInit(dataStaions);
  enouvoTrain.createTrainsInit(dataTrains);

  document.getElementById('btn_train').addEventListener('click', function() {
    enouvoTrain.humanSelectTrains('ABC123');
  });
  document.getElementById('btn_trains').addEventListener('click', function() {
    enouvoTrain.humanSelectTrains(['ABC123', 'ABC098']);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
