import { getNewElement } from '../libs';

export class BaseAsset extends google.maps.OverlayView {
  constructor(args) {
    super();
    this._prefix_event = 'asset_';
    this._observers = args.observers;
    this._events = args.events;
    this.latlng = args.latlng;
    this._html = null;
    this._hide = args.hide || false;
    this._zIndex = 1;
    this.html = args.html;
    this.properties = args.properties;

    this.assetCanMove = false;
    this.assetCanSelect = false;
    this.assetSelected = false;
    this.setMap(args.map);
  }

  onAdd() {
    this._createDiv();
    this._setup();
    this._addEventsDom();
    this._addEventObserver(this._events);
  }

  _setup() {
    const panes = this.getPanes();
    panes.overlayImage.appendChild(this._html.wrapper);
  }

  _positionDiv() {
    const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    if (point) {
      this._html.wrapper.style.left = `${point.x}px`;
      this._html.wrapper.style.top = `${point.y}px`;
    }
  }

  _trigger(event, data) {
    this._observers.emitEvent(this._prefix_event + event, [data]);
  }

  _addEventObserver(events) {
    if (typeof events !== 'object') {
      return;
    }
    this._observers.addListeners(events);
  }

  _createDiv() {
    if (!this._html) {
      this._html = {};
    }
    this._html.content = getNewElement({ html: this.html });
    this._html.wrapper = getNewElement({ className: 'enouvo-trains-asset' });
    this._html.wrapper.style.zIndex = this._zIndex;
    this._html.wrapper.appendChild(this._html.content);
  }

  _addEventsDom() {}

  _drawHide() {
    this._html.wrapper.style.visibility = this._hide ? 'hidden' : 'visible';
  }

  draw() {
    this._positionDiv();
  }

  hide() {
    this._hide = true;
    this._drawHide();
  }

  show() {
    this._hide = false;
    this._drawHide();
  }

  destroy() {
    this.remove();
  }

  remove() {
    if (this._html && this._html.wrapper) {
      this._html.wrapper.parentNode.removeChild(this._html.wrapper);
      this._html.wrapper = null;
      this._html.content = null;
    }
  }

  getPosition() {
    return this.latlng;
  }

  isSeleted() {
    return this.assetSelected;
  }

  /* Event Human */
  onClickToggleSelect() {
    this._toggleSelected();
  }

  doSelect() {
    this.assetSelected = true;
    this._onSelectedChangeTemplate();
  }

  doDeselect() {
    this.assetSelected = false;
    this._onDeselectedChangeTemplate();
  }

  _toggleSelected() {
    this.assetSelected = !this.assetSelected;
    this.assetSelected
      ? this._onSelectedChangeTemplate()
      : this._onDeselectedChangeTemplate();
  }

  _onSelectedChangeTemplate() {
    console.log('Base: _onSelectedChangeTemplate');
  }

  _onDeselectedChangeTemplate() {
    console.log('Base: _onDeselectedChangeTemplate');
  }
}
