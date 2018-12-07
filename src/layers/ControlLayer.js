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
export * from './ControlLayer';
export class ControlLayer {
  constructor(args) {
    this._map = args.map;
    this.position = args.position || 1;
    this._html = null;
  }

  setup() {
    this.createLayer();
    this.setupControl();
  }

  setupLayer() {
    this.setupLayer();
  }

  setupControl() {}

  createLayer() {
    if (!this._html) {
      this._html = {};
    }
    /* Inner */
    const getNewElement = args => {
      const element = document.createElement('div');
      if (args && args.className) {
        element.className = args.className;
      }
      if (args && args.html) {
        element.innerHTML = args.html;
      }
      return element;
    };

    /* Div */
    this._html.layer = getNewElement({
      className:
        'enouvo-trains-layer controllayer layer-postion' + this.position
    });

    this._html.layer.style.zIndex = 1;

    this._map.controls[this.position].push(this._html.layer);
  }
}
