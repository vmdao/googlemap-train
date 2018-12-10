import { toLatLng, setHTML, GOOGLE_MAP_API } from '../utils';

export class BaseTooltip extends GOOGLE_MAP_API.OverlayView {
  constructor(opts) {
    super(opts);
    this._eventPrefix = 'enouvo-trains-event';
    const _defaultOptions = {
      openOnMarkerClick: true,
      closeOnMapClick: true,
      closeWhenOthersOpen: false,
      panOnOpen: true
    };

    this._html = null;
    this._opts = Object.assign(_defaultOptions, opts);
    this._callbacks = this._opts.callbacks || {};
    this._marker = this._opts.marker;
    this._map = this._opts.map;
    this._position = toLatLng(this._opts.position);
    this._isOpen = false;
    this._listeners = [];
    // This listener remains active when the info window is closed.
    if (this._marker && this._opts.openOnMarkerClick) {
      this.trackListener(
        GOOGLE_MAP_API.event.addListener(this._marker, 'click', () => {
          if (!this.getMap()) {
            this.open();
          }
        }),
        true
      );
    }

    // When using a position the default option for the offset is 0
    if (this._position && !this._opts.offset) {
      this._opts.offset = {
        top: '0px',
        left: '0px'
      };
    }
  }

  // Activate the specified callback and return the result
  activateCallback(callback) {
    const lambda = this._callbacks[callback];
    return lambda ? lambda.apply(this) : undefined;
  }

  // Track the provided listener. A persistent listener means it remains
  // tracked even if the info window is closed.
  trackListener(listener, persistent) {
    this._listeners.push({ listener, persistent });
  }

  // Will clear all listeners that are used during the open state.
  clearListeners(clearPersistent) {
    if (this._listeners) {
      this._listeners.forEach(e => {
        if (clearPersistent || !e.persistent) {
          GOOGLE_MAP_API.event.removeListener(e.listener);
          e.listener = null;
        }
      });
      this._listeners = this._listeners.filter(e => {
        return e.listener != null;
      });
    }
  }

  isOpen() {
    return this._isOpen;
  }

  // Open the info window after attaching to a specific marker.
  open() {
    const result = this.activateCallback('beforeOpen');
    if (result !== undefined && !result) {
      return;
    }
    if (this._marker) {
      this.setMap(this._marker.getMap());
    } else if (this._map && this._position) {
      this.setMap(this._map);
    }
  }

  // Close the info window.
  close() {
    const result = this.activateCallback('beforeClose');
    if (result !== undefined && !result) {
      return;
    }
    this.clearListeners();
    this.setMap(null);
  }

  // Force close the map and remove any event listeners attached to google
  destroy() {
    if (this.getMap()) {
      this.setMap(null);
    }
    // Make sure to clear all persistent listeners
    this.clearListeners(true);
  }

  setContent(content) {
    this._opts.content = content;
    if (this._html && this._html.content) {
      setHTML(this._html.content, content);
    }
  }

  setPosition(latLng) {
    this._position = toLatLng(latLng);
    if (this._isOpen && this._position) {
      this.draw();
      this.resize();
      this.reposition();
    }
  }

  // Implementation of OverlayView draw method.
  draw() {
    if (!this.getMap() || !this._html) {
      return;
    }
    if (!this._marker && !this._position) {
      return;
    }

    const divPixel = this.getProjection().fromLatLngToDivPixel(
      this._position || this._marker.getPosition()
    );

    if (divPixel) {
      const widthInfo = this._html.floatWrapper.clientWidth;
      const heightInfo = this._html.floatWrapper.clientHeight;

      this._html.floatWrapper.style.top = `${Math.floor(divPixel.y)}px`;
      this._html.floatWrapper.style.left = `${Math.floor(divPixel.x)}px`;
    }
    if (!this._isOpen) {
      this._isOpen = true;
      this.resize();
      this.reposition();
      this.activateCallback('afterOpen');
      GOOGLE_MAP_API.event.trigger(
        this.getMap(),
        `${this._eventPrefix}opened`,
        this
      );
    }
  }

  // Implementation of OverlayView onAdd method.
  onAdd() {
    if (this._html) {
      return;
    }

    const getNewElement = args => {
      const element = document.createElement('div');
      if (args && args.className) {
        element.className = args.className;
      }
      return element;
    };

    this._html = {};

    this._html.content = getNewElement({
      className: 'enouvo-trains-tooltip-inner'
    });

    if (this._opts.content) {
      setHTML(this._html.content, this._opts.content);
    }

    this._html.floatWrapper = getNewElement({
      className: 'enouvo-trains-tooltip'
    });

    this._html.floatWrapper.appendChild(this._html.content);
    this._html.floatWrapper.style.position = 'absolute';

    // Add the wrapper to the Google Maps float pane
    this.getPanes().floatPane.appendChild(this._html.floatWrapper);

    // Now add all the event listeners
    const map = this.getMap();
    this.clearListeners();
    if (this._opts.closeOnMapClick) {
      this.trackListener(
        GOOGLE_MAP_API.event.addListener(map, 'click', () => {
          this.close();
        })
      );
    }

    if (this._opts.closeWhenOthersOpen) {
      this.trackListener(
        GOOGLE_MAP_API.event.addListener(
          map,
          `${_eventPrefix}opened`,
          other => {
            if (this !== other) {
              this.close();
            }
          }
        )
      );
    }

    // Clear out the previous map bounds
    this._previousWidth = null;
    this._previousHeight = null;

    this.trackListener(
      GOOGLE_MAP_API.event.addListener(map, 'bounds_changed', () => {
        const d = map.getDiv();
        const ow = d.offsetWidth;
        const oh = d.offsetHeight;
        const pw = this._previousWidth;
        const ph = this._previousHeight;
        if (pw === null || ph === null || pw !== ow || ph !== oh) {
          this._previousWidth = ow;
          this._previousHeight = oh;
          this.resize();
        }
      })
    );

    // Marker moves
    if (this._marker) {
      this.trackListener(
        GOOGLE_MAP_API.event.addListener(
          this._marker,
          'position_changed',
          () => {
            this.draw();
          }
        )
      );
    }

    // Stop the mouse event propagation
    const mouseEvents = [
      'click',
      'dblclick',
      'rightclick',
      'contextmenu',
      'drag',
      'dragend',
      'dragstart',
      'mousedown',
      'mouseout',
      'mouseover',
      'mouseup',
      'touchstart',
      'touchend',
      'touchmove',
      'wheel',
      'mousewheel',
      'DOMMouseScroll',
      'MozMousePixelScroll'
    ];
    mouseEvents.forEach(event => {
      this.trackListener(
        GOOGLE_MAP_API.event.addDomListener(
          this._html.floatWrapper,
          event,
          e => {
            e.cancelBubble = true;
            if (e.stopPropagation) {
              e.stopPropagation();
            }
          }
        )
      );
    });

    this.activateCallback('open');
  }

  // Implementation of OverlayView onRemove method
  onRemove() {
    this.activateCallback('close');
    if (this._html) {
      const parent = this._html.floatWrapper.parentElement;
      if (parent) {
        parent.removeChild(this._html.floatWrapper);
      }
      this._html = null;
    }
    this._isOpen = false;
    this.activateCallback('afterClose');
  }

  // The map inner bounds used for panning and resizing
  getMapInnerBounds() {
    const mb = this.getMap()
      .getDiv()
      .getBoundingClientRect();

    let mib = {
      top: mb.top,
      right: mb.right,
      bottom: mb.bottom,
      left: mb.left
    };

    mib.width = mib.right - mib.left;
    mib.height = mib.bottom - mib.top;
    return mib;
  }

  // Pan the Google Map such that the info window is visible
  reposition() {
    if (!this._opts.panOnOpen || !this._html) {
      return;
    }
    const mib = this.getMapInnerBounds();
    const wb = this._html.content.getBoundingClientRect();
    let dx = 0;
    let dy = 0;

    if (mib.left >= wb.left) {
      dx = wb.left - mib.left;
    } else if (mib.right <= wb.right) {
      dx = wb.left - (mib.right - wb.width);
    }

    if (mib.top >= wb.top) {
      dy = wb.top - mib.top;
    } else if (mib.bottom <= wb.bottom) {
      dy = wb.top - (mib.bottom - wb.height);
    }

    if (dx !== 0 || dy !== 0) {
      this.getMap().panBy(dx, dy);
    }
  }

  // Resize the info window to fit within the map bounds and edge offset
  resize() {
    if (!this._html) {
      return;
    }
    const mib = this.getMapInnerBounds();
    // Handle the max width
    let maxWidth = mib.width;
    if (this._opts.maxWidth !== undefined) {
      maxWidth = Math.min(maxWidth, this._opts.maxWidth);
    }
    maxWidth -=
      this._html.floatWrapper.offsetWidth - this._html.content.offsetWidth;
    this._html.content.style.maxWidth = `${maxWidth}px`;

    // Handle the max height
    let maxHeight = mib.height;
    if (this._opts.maxHeight !== undefined) {
      maxHeight = Math.min(maxHeight, this._opts.maxHeight);
    }
    maxHeight -=
      this._html.floatWrapper.offsetHeight - this._html.content.offsetHeight;
    this._html.content.style.maxHeight = `${maxHeight}px`;
  }
}
