import { GOOGLE_MAP_API } from '../libs';

export class RouteAsset extends GOOGLE_MAP_API.Polyline {
  constructor(args) {
    super(args);
    this._prefix_event = 'line_asset_';
    this.options = args.options;
    this._map = args.map;
    this._properties = args.properties;
    this._hide = args.hide || false;
    this._observers = args.observers || null;
    this._events = args.events || [];

    this.assetCanSelect = false;
    this.assetSelected = false;
    this._setup();
  }

  onAdd() {
    console.log('onAdd');
    this._addEventObserver();
  }

  hide() {
    this._hide = true;
    this.setVisible(!this._hide);
  }

  show() {
    this._hide = false;
    this.setVisible(!this._hide);
  }

  getData() {
    return this._properties;
  }

  doSelect() {
    this.assetSelected = true;
    this._onSelectedChangeTemplate();
  }

  doDeselect() {
    this.assetSelected = false;
    this._onDeselectedChangeTemplate();
  }

  _setup() {
    this._addEventDom();
    this._addEventObserver(this._events);
  }

  _addEventObserver(events) {
    if (typeof events !== 'object') {
      return;
    }
    this._observers.addListeners(events);
  }

  _addEventDom() {
    this.addListener('click', () => {
      this._trigger('click', {
        event: 'clicked',
        data: { type: 'line', value: this._properties }
      });
    });
  }

  _trigger(event, data) {
    this._observers.emitEvent(this._prefix_event + event, [data]);
  }

  _onSelectedChangeTemplate() {
    console.log('Base: _onSelectedChangeTemplate');
  }

  _onDeselectedChangeTemplate() {
    console.log('Base: _onDeselectedChangeTemplate');
  }
}
