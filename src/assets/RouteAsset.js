import { EventEmitter } from '../libs/EventEmitter';

export class RouteAsset extends google.maps.Polyline {
  constructor(args) {
    super(args);
    this._map = args.map;
    this.properties = args.properties;
    this.options = args.options;

    this.assetCanSelect = false;
    this.assetSelected = false;
  }
}
