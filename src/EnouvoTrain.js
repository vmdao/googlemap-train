import { TrainAsset, StationAsset, RouteAsset } from './assets';
import { ZoomControlLayer, GroupControlLayer } from './layers';

var polyLineColor = '#949c30';
var polyLineWeight = 6;
var polyLineStrokeOpacity = 1;

// complete network with selected line
var lineAndNetworkLineColor = '#d01a6c';
var lineAndNetworkLineWeight = 10;
var lineAndNetworkLineStrokeOpacity = 0.5;

export class EnouvoTrain {
  constructor(map) {
    if (!map) {
      throw new Error('Google map not exist');
    }

    this._map = map;
    this._poolLines = [];
    this._poolTrains = [];
    this._poolStations = [];

    this.setupInit();
  }

  setupInit() {
    this.setupMap();
    this.setupZoom();
    this.setupControl();
  }

  setupMap() {}

  setupZoom() {
    const zoomControl = new ZoomControlLayer({ map: this._map, position: 10 });
    zoomControl.setup();
    const groupControl = new GroupControlLayer({
      map: this._map,
      position: 10
    });
    groupControl.setup();
  }

  setupControl() {}

  createTrainsInit(newDataTrains) {
    this.destroyTrains(this._poolTrains);
    this._poolTrains = this.createTrains(newDataTrains);
  }

  createTrains(newDataTrains) {
    return newDataTrains.reduce((current, data) => {
      try {
        const train = this.createTrain(data);
        return current.push(train);
      } catch (error) {
        return current;
      }
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
      properties: dataTrain.data
    });

    return train;
  }

  destroyTrains(trains) {
    trains.forEach(train => {
      train.destroy();
    });
  }

  updateAndCreateTrain(dataTrain) {
    const train = this._poolTrains.find(train => {
      return (train.data.tdn = dataTrain.tdn);
    });

    if (!train) {
      this._poolTrains.push(this.createTrain(dataTrain));
    } else {
      train.updateData(dataTrain);
    }
  }

  createStationsInit(newDataTrains) {
    this.destroyTrains(this._poolTrains);
    this._poolTrains = this.createTrains(newDataTrains);
  }

  createStations(newDataStations) {
    return newDataStations.reduce((current, data) => {
      try {
        const station = this.createStation(data);
        return current.push(station);
      } catch (error) {
        return current;
      }
    }, []);
  }

  createStation(dataStation) {
    const dataLatlng = dataStation.latlng;
    if (!dataLatlng) {
      throw new Error('Station latlng not exist');
    }

    const latlng = new google.maps.LatLng(dataLatlng.lat, dataLatlng.lng);

    const marker = new StationAsset({
      map: this._map,
      latlng: latlng,
      properties: dataStation.data
    });

    return marker;
  }

  destroyStations(stations) {
    stations.forEach(station => {
      station.destroy();
    });
  }

  /*
   * Line
   */
  createLinesInit(newDataLines) {
    this.destroyLines(this._poolLines);
    this._poolLines = this.createLines(newDataLines);
  }

  createLines(newDataLines) {
    return newDataLines.reduce((current, data) => {
      try {
        const line = this.createLine(data);
        return current.push(line);
      } catch (error) {
        console.log('error', error);
        return current;
      }
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
      }
    });
    console.log('line', flightPlanCoordinates);
    return line;
  }

  destroyLines(lines) {
    lines.forEach(line => {
      line.destroy();
    });
  }
}
