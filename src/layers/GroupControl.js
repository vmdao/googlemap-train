const GOOGLEMAP_API = google.maps;
import { ControlLayer } from './ControlLayer';
export class GroupControlLayer extends ControlLayer {
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

    /* Button  Line*/
    const buttonLineDiv = getNewElement({
      className: 'groupbutton group-line',
      html: '<div class="groupbutton-inner"><img src="" ></div>'
    });

    /* Button Station */
    const buttonStationDiv = getNewElement({
      className: 'groupbutton group-station',
      html: '<div class="groupbutton-inner"><img src="" ><</div>'
    });

    /* Button Train */
    const buttonTrainDiv = getNewElement({
      className: 'groupbutton group-train',
      html: '<div class="groupbutton-inner"><img src="" ><</div>'
    });

    const content = getNewElement({
      className: 'groupcontrol-inner'
    });

    content.appendChild(buttonLineDiv);
    content.appendChild(buttonStationDiv);
    content.appendChild(buttonTrainDiv);

    const wrapperControl = getNewElement({
      className: 'groupcontrol'
    });

    wrapperControl.appendChild(content);

    this._html.layer.appendChild(wrapperControl);
    // Setup the click event listener - zoomIn
    const map = this._map;
    GOOGLEMAP_API.event.addDomListener(buttonLineDiv, 'click', function() {
      alert(123);
    });

    // Setup the click event listener - zoomOut
    GOOGLEMAP_API.event.addDomListener(buttonStationDiv, 'click', function() {
      alert(456);
    });
  }
}
