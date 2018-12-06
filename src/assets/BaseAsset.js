import { EventEmitter } from '../libs/EventEmitter';

export class BaseAsset extends google.maps.OverlayView {
  constructor(args) {
    super();
    this.latlng = args.latlng;
    this.html = args.html;
    this.setMap(args.map);

    this.poolListener = [];

    this.assetCanMove = false;
    this.assetCanSelect = false;
    this.assetSelected = false;

    this._createObserver();
  }

  _createObserver() {
    this.assetObserver = new EventEmitter();

    const events = {
      toggle: () => {
        this.toggleSelect();
      },

      selected: () => {
        this.doSelect();
      },

      unSelected: () => {
        this.doDeselect();
      }
    };

    this.assetObserver.addListeners(events);
  }

  createDiv() {
    this.div = document.createElement('div');
    this.div.className = 'enouvo-marker';

    this.div.style.position = 'absolute';
    this.div.style.cursor = 'pointer';
    if (this.html) {
      this.div.innerHTML = this.html;
    }
    this.eventDom();
  }

  eventDom() {
    google.maps.event.addDomListener(this.div, 'click', event => {
      google.maps.event.trigger(this, 'click');
    });

    google.maps.event.addDomListener(this.div, 'mouseenter', event => {
      google.maps.event.trigger(this, 'mouseenter');
    });

    google.maps.event.addDomListener(this.div, 'mouseout', event => {
      google.maps.event.trigger(this, 'mouseout');
    });
  }

  appendDivToOverlay() {
    const panes = this.getPanes();
    panes.overlayImage.appendChild(this.div);
  }

  positionDiv() {
    const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    if (point) {
      this.div.style.left = `${point.x}px`;
      this.div.style.top = `${point.y}px`;
    }
  }

  draw() {
    if (!this.div) {
      this.createDiv();
      this.appendDivToOverlay();
    }
    this.positionDiv();
  }

  remove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
  }

  getPosition() {
    return this.latlng;
  }

  getDraggable() {
    return false;
  }

  isSeleted() {
    return this.assetSelected;
  }

  action(message) {
    this.assetObserver.emitEvent(message.action, [message.data]);
  }

  toggleSelect() {
    this.assetSelected = !this.assetSelected;
    if (this.assetSelected) {
      this.doSelectTemplate();
    } else {
      this.doDeselectTemplate();
    }
  }

  doSelect() {
    this.assetSelected = true;
    this.doSelectTemplate();
  }

  doDeselect() {
    this.assetSelected = false;
    this.doDeselectTemplate();
  }

  doSelectTemplate() {
    console.log('doSelectTemplate');
  }

  doDeselectTemplate() {}
}
