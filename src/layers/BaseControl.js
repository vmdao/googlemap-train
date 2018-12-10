import { getNewElement } from '../utils';

export class BaseControl {
  constructor(args) {
    this._observers = args.observers;
    this._events = args.events;
    this._html = null;
    this._prefix_event = 'control_';
  }

  register() {
    this._addEventObserver(this._events);
    this._draw();
  }

  unregister() {
    this._remove();
  }

  addTo(layer) {
    this._layer = layer;
    this._setup();
  }

  _addEventObserver(events) {
    if (typeof events !== 'object') {
      return;
    }
    this._observers.addListeners(events);
  }

  _draw() {
    if (!this._html) {
      this._html = {};
    }

    this._html.wrapper = new getNewElement({
      className: 'enouvo-trains-control'
    });
  }

  _remove() {
    if (this._html) {
      this._html.wrapper &&
        this._html.wrapper.parentNode.removeChild(this._html.wrapper);
      this._html.wrapper = null;
    }
  }

  _setup() {
    if (!this._layer) {
      throw new Error('Layer not exist');
    }

    if (!this._layer._html) {
      throw new Error('Layer dom ƒnot exist');
    }

    this._layer._html.content.appendChild(this._html.wrapper);
  }

  _trigger(event, data) {
    this._observers.emitEvent(this._prefix_event + event, [data]);
  }
}
