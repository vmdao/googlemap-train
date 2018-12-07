const GOOGLEMAP_API = google.maps;
import { ControlLayer } from './ControlLayer';
export class ZoomControlLayer extends ControlLayer {
  constructor(args) {
    super(args);
  }

  setupControl() {
    this.addControl();
  }

  addControl() {
    if (!this._html) {
      throw new Error('ControlLayer wrong');
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

    /* Button Zoom In */

    const buttonZoomInDiv = getNewElement({
      className: 'zoombutton zoom-in',
      html: '<div class="zoombutton-inner"> + </div>'
    });
    /* Button Zoom Out */
    const buttonZoomOutDiv = getNewElement({
      className: 'zoombutton zoom-out',
      html: '<div class="zoombutton-inner"> - </div>'
    });

    const content = getNewElement({
      className: 'zoomcontrol-inner'
    });

    content.appendChild(buttonZoomInDiv);
    content.appendChild(buttonZoomOutDiv);

    const wrapperControl = getNewElement({
      className: 'zoomcontrol'
    });

    wrapperControl.appendChild(content);

    this._html.layer.appendChild(wrapperControl);
    // Setup the click event listener - zoomIn
    const map = this._map;
    GOOGLEMAP_API.event.addDomListener(buttonZoomInDiv, 'click', function() {
      map.setZoom(map.getZoom() + 1);
    });

    // Setup the click event listener - zoomOut
    GOOGLEMAP_API.event.addDomListener(buttonZoomOutDiv, 'click', function() {
      map.setZoom(map.getZoom() - 1);
    });
  }
}
