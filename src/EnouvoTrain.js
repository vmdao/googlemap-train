import { TrainAsset, StationAsset, RouteAsset } from './assets';
import { ControlLayer, ZoomControl, GroupControl } from './layers';
import { EventEmitter, GOOGLE_MAP_API } from './utils';

const styleGoogleMap = {
  map: [
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ],
  polyline: {
    polyLineColor: '#949c30',
    polyLineWeight: 7,
    polyLineStrokeOpacity: 1,
    lineAndNetworkLineColor: '#d01a6c',
    lineAndNetworkLineWeight: 10,
    lineAndNetworkLineStrokeOpacity: 0.5
  }
};

export class EnouvoTrain {
  constructor(mapOptions, args) {
    const mapLatLng = new GOOGLE_MAP_API.LatLng(
      mapOptions.latLng.lat,
      mapOptions.latLng.lng
    );

    const _mapOptions = {
      center: mapLatLng,
      zoom: mapOptions.zoom || 14,
      disableDefaultUI: true,
      styles: styleGoogleMap.map
    };

    this._map = new GOOGLE_MAP_API.Map(mapOptions.element, _mapOptions);
    this._prefix_event = 'human_';
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
      const lonlngs = selectedTrains.map(train => {
        train.doSelect();
        return train.getPosition();
      });
      this._focus(lonlngs);
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

    const latlng = new GOOGLE_MAP_API.LatLng(dataLatlng.lat, dataLatlng.lng);

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

    const latlng = new GOOGLE_MAP_API.LatLng(dataLatlng.lat, dataLatlng.lng);

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
    const line = new RouteAsset({
      map: this._map,
      options: {
        path: flightPlanCoordinates,
        strokeColor: polyLineColor,
        strokeOpacity: polyLineStrokeOpacity,
        strokeWeight: polyLineWeight
      },
      properties: dataLine.data,
      observers: this._observers,
      events: this._observeLine
    });
    return line;
  }

  /* Function Private */

  _findTrain(dataTrain) {
    return this._poolTrains.find(train => {
      const data = train.getData();
      return data.tdn === dataTrain;
    });
  }

  _filterTrains(dataTrains) {
    if (!Array.isArray(dataTrains)) {
      const train = this._findTrain(dataTrains);
      return train ? [train] : [];
    } else {
      return this._poolTrains.filter(train => {
        const data = train.getData();
        return dataTrains.find(dataTrain => dataTrain === data.tdn);
      });
    }
  }

  _findStation(dataStation) {
    return this._poolStations.find(station => {
      return (station.data.id = dataStation.id);
    });
  }

  _filterStations(dataStations) {
    if (!Array.isArray(dataStations)) {
      const station = this._findStation(dataStations);
      return station ? [station] : [];
    } else {
      return this._poolStations.filter(station => {
        const data = station.getData();
        return dataStations.find(dataStation => dataStation === data.id);
      });
    }
  }

  _findLine(dataLine) {
    return this._poolLines.find(line => {
      return (line.properties.id = dataLine.id);
    });
  }

  _filterLines(dataLines) {
    if (!Array.isArray(dataLines)) {
      const line = this._findStation(dataLines);
      return line ? [line] : [];
    } else {
      return this._poolLines.filter(line => {
        const data = line.getData();
        return dataLines.find(dataLine => dataLine === data.id);
      });
    }
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
      },
      train_asset_hover: message => {
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
        const { event, value, data } = message;
        if (event === 'clicked') {
          if (data === 'GROUP_TRAIN') {
            this._poolTrains.forEach(train => {
              value ? train.show() : train.hide();
            });
          } else if (data === 'GROUP_STATION') {
            this._poolStations.forEach(train => {
              value ? train.show() : train.hide();
            });
          } else if (data === 'GROUP_LINE') {
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

  _focus(latlngs) {
    if (latlngs.length === 1) {
      this._map.panTo(latlngs[0]);
      return;
    }
    const bounds = latlngs.reduce((current, latlng) => {
      current.extend(latlng);
      return current;
    }, new GOOGLE_MAP_API.LatLngBounds());

    this._map.panToBounds(bounds, 100);
  }
}
