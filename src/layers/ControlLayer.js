/*** ControlLayer 
* Position 
BOTTOM: 11
BOTTOM_CENTER: 11
BOTTOM_LEFT: 10
BOTTOM_RIGHT: 12
CENTER: 13
LEFT: 5
LEFT_BOTTOM: 6
LEFT_CENTER: 4
LEFT_TOP: 5
RIGHT: 7
RIGHT_BOTTOM: 9
RIGHT_CENTER: 8
RIGHT_TOP: 7
TOP: 2
TOP_CENTER: 2
TOP_LEFT: 1
TOP_RIGHT: 3
*/

import { getNewElement } from '../utils';

export class ControlLayer {
  constructor(args) {
    this._map = args.map || null;
    this._position = args.position || 1;
    this._html = null;
    this.register();
  }

  addTo(map) {
    this._map = map;
    this._setup();
  }

  register() {
    this._draw();
  }

  unregister() {
    this._remove();
  }

  addControl(control) {
    control.register();
    control.addTo(this);
  }

  _setup() {
    this._map.controls[this._position].push(this._html.content);
  }

  _draw() {
    if (!this._html) {
      this._html = {};
    }

    /* Div */
    this._html.content = getNewElement({
      className: 'enouvo-trains-layer layer-postion' + this._position
    });

    this._html.content.style.zIndex = 1;
  }

  _remove() {
    if (this._html) {
      this._html.wrapper &&
        this._html.wrapper.parentNode.removeChild(this._html.wrapper);
      this._html.wrapper = null;
    }
  }
}
