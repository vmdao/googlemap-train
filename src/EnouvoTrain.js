import { TrainAsset, StationAsset, RouteAsset } from './assets';
import { ControlLayer, ZoomControl, GroupControl } from './layers';
import { EventEmitter } from './libs/EventEmitter';

var polyLineColor = '#949c30';
var polyLineWeight = 6;
var polyLineStrokeOpacity = 1;

// complete network with selected line
var lineAndNetworkLineColor = '#d01a6c';
var lineAndNetworkLineWeight = 10;
var lineAndNetworkLineStrokeOpacity = 0.5;

export class EnouvoTrain {
  constructor(args) {
    if (!args.map) {
      throw new Error('Google map not exist');
    }
    this._prefix_event = 'human_';
    this._map = args.map;
    this._events = args.events;
    this._poolLines = [];
    this._poolTrains = [];
    this._poolStations = [];
    this._observers = new EventEmitter();

    this._setup();
  }

  humanSelectTrains(dataTrains) {
    const selectedTrains = this._filterTrains(dataTrains);
    if (selectedTrains.length) {
      selectedTrains.forEach(train => {
        train.doSelect();
      });
    }
  }

  humanSelectStations(dataStations) {
    const selectedStations = this._filterStations(dataStations);
    if (selectedStations.length) {
      selectedStations.forEach(station => {
        station.doSelect();
      });
    }
  }

  humanSelectLines(dataLines) {
    const selectedLines = this._filterLines(dataLines);
    if (selectedLines.length) {
      selectedLines.forEach(line => {
        line.doSelect();
      });
    }
  }

  createTrainsInit(newDataTrains) {
    this._destroyTrains(this._poolTrains);
    this._poolTrains = this.createTrains(newDataTrains);
  }

  createTrains(newDataTrains) {
    return newDataTrains.reduce((current, data) => {
      try {
        const train = this.createTrain(data);
        current.push(train);
      } catch (error) {}
      return current;
    }, []);
  }

  createTrain(dataTrain) {
    const dataLatlng = dataTrain.latlng;
    if (!dataLatlng) {
      throw new Error('Station latlng not exist');
    }

    const latlng = new google.maps.LatLng(dataLatlng.lat, dataLatlng.lng);

    const train = new TrainAsset({
      map: this._map,
      latlng: latlng,
      properties: dataTrain.data,
      observers: this._observers,
      events: this._observeTrain
    });

    return train;
  }

  updateAndCreateTrain(dataTrain) {
    const train = this._findTrains(dataTrain);

    if (!train) {
      this._poolTrains.push(this.createTrain(dataTrain));
    } else {
      train.updateData(dataTrain);
    }
  }

  createStationsInit(newDataStations) {
    this._destroyStations(this._poolStations);
    this._poolStations = this.createStations(newDataStations);
    console.log(this, newDataStations);
  }

  createStations(newDataStations) {
    return newDataStations.reduce((current, data) => {
      try {
        const station = this.createStation(data);
        current.push(station);
      } catch (error) {
        console.log(error);
      }
      return current;
    }, []);
  }

  createStation(dataStation) {
    const dataLatlng = dataStation.latlng;
    if (!dataLatlng) {
      throw new Error('Station latlng not exist');
    }

    const latlng = new google.maps.LatLng(dataLatlng.lat, dataLatlng.lng);

    const station = new StationAsset({
      map: this._map,
      latlng: latlng,
      properties: dataStation.data,
      observers: this._observers,
      events: this._observeStation
    });

    return station;
  }

  /*
   * Line
   */
  createLinesInit(newDataLines) {
    this._destroyLines(this._poolLines);
    this._poolLines = this.createLines(newDataLines);
  }

  createLines(newDataLines) {
    return newDataLines.reduce((current, data) => {
      try {
        const line = this.createLine(data);
        current.push(line);
      } catch (error) {}
      return current;
    }, []);
  }

  createLine(dataLine) {
    const flightPlanCoordinates = [
      { lat: -31.9546781, lng: 115.852662 },
      { lat: 37.772, lng: -122.214 },
      { lat: 21.291, lng: -157.821 },
      { lat: -18.142, lng: 178.431 },
      { lat: -27.467, lng: 153.027 }
    ];

    const line = new RouteAsset({
      map: this._map,
      properties: dataLine.data,
      options: {
        path: flightPlanCoordinates,
        strokeColor: polyLineColor,
        strokeOpacity: polyLineStrokeOpacity,
        strokeWeight: polyLineWeight
      },
      observers: this._observers,
      events: this._observeLine
    });
    return line;
  }

  /* Function Private */

  _findTrain(dataTrain) {
    return this._poolTrains.find(train => {
      return (train.data.tdn = dataTrain.tdn);
    });
  }

  _filterTrains(dataTrains) {
    return dataTrains.filter(dataTrain => {
      return this._findTrain(dataTrain);
    });
  }

  _findStation(dataStation) {
    return this._poolStations.find(station => {
      return (station.data.id = dataStation.id);
    });
  }

  _filterStations(dataStations) {
    return dataStations.filter(dataStation => {
      return this._findStation(dataStation);
    });
  }

  _findLine(dataLine) {
    return this._poolLines.find(line => {
      return (line.properties.id = dataLine.id);
    });
  }

  _filterLines(dataLines) {
    return dataLines.filter(dataLine => {
      return this._findLine(dataLine);
    });
  }

  _destroyTrains(trains) {
    trains.forEach(train => {
      train.destroy();
    });
  }

  _destroyLines(lines) {
    lines.forEach(line => {
      line.destroy();
    });
  }

  _destroyStations(stations) {
    stations.forEach(station => {
      station.destroy();
    });
  }

  _setup() {
    this._setupMap();
    this._setupControlLayer();
    this._addEventObserver(this._events);
  }

  _trigger(event, data) {
    this._observers.emitEvent(this._prefix_event + event, [data]);
  }

  _addEventObserver(events) {
    if (typeof events !== 'object') {
      return;
    }
    this._observers.addListeners(events);
    this._observeTrain = {
      train_asset_click: message => {
        this._trigger('train', message);
      }
    };
    this._observeStation = {
      station_asset_click: message => {
        this._trigger('station', message);
      }
    };
    this._observeLine = {
      line_asset_click: message => {
        this._trigger('line', message);
      }
    };
  }

  _setupMap() {}

  _setupControlLayer() {
    const groupControlEvents = {
      control_group_click: message => {
        const { event, data } = message;
        const { type, value } = data;
        if (event === 'clicked') {
          if (type === 'GROUP_TRAIN') {
            this._poolTrains.forEach(train => {
              value ? train.show() : train.hide();
            });
          } else if (type === 'GROUP_STATION') {
            this._poolStations.forEach(train => {
              value ? train.show() : train.hide();
            });
          } else if (type === 'GROUP_LINE') {
            this._poolLines.forEach(train => {
              value ? train.show() : train.hide();
            });
          }
        }
      }
    };

    const zoomControlEvents = {
      control_zoom_click: message => {
        if (!message.event === 'clicked') {
          return;
        }
        if (message.data === 'ZOOM_IN') {
          this._map.setZoom(this._map.getZoom() + 1);
        } else {
          this._map.setZoom(this._map.getZoom() - 1);
        }
      }
    };

    const groupControl = new GroupControl({
      observers: this._observers,
      events: groupControlEvents
    });

    const zoomControl = new ZoomControl({
      observers: this._observers,
      events: zoomControlEvents
    });
    const controlLayer = new ControlLayer({ map: this._map, position: 10 });

    controlLayer.addControl(groupControl);
    controlLayer.addControl(zoomControl);

    controlLayer.addTo(this._map);
  }
}
