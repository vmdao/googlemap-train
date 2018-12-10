import { BaseControl } from './BaseControl';
import { getNewElement } from '../libs';

export class ZoomControl extends BaseControl {
  constructor(args) {
    super(args);
    this._prefix_event = 'control_zoom_';
  }

  _draw() {
    super._draw();

    /* Button Zoom In */

    const buttonZoomInDiv = getNewElement({
      className: 'zoombutton zoom-in',
      html:
        '<div class="zoombutton-inner"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 24 24"><path d="m23,10h-8.5c-0.3,0-0.5-0.2-0.5-0.5v-8.5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v8.5c0,0.3-0.2,0.5-0.5,0.5h-8.5c-0.6,0-1,0.4-1,1v2c0,0.6 0.4,1 1,1h8.5c0.3,0 0.5,0.2 0.5,0.5v8.5c0,0.6 0.4,1 1,1h2c0.6,0 1-0.4 1-1v-8.5c0-0.3 0.2-0.5 0.5-0.5h8.5c0.6,0 1-0.4 1-1v-2c0-0.6-0.4-1-1-1z"/></svg></div>'
    });
    /* Button Zoom Out */
    const buttonZoomOutDiv = getNewElement({
      className: 'zoombutton zoom-out',
      html:
        '<div class="zoombutton-inner"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 24 24"><path d="M24,11c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V11z"/></svg></div>'
    });

    const innerControl = getNewElement({
      className: 'zoomcontrol-inner'
    });

    innerControl.appendChild(buttonZoomInDiv);
    innerControl.appendChild(buttonZoomOutDiv);

    this._html.content = getNewElement({
      className: 'zoomcontrol'
    });

    this._html.content.appendChild(innerControl);
    this._html.wrapper.appendChild(this._html.content);

    buttonZoomInDiv.addEventListener('click', () => {
      this._trigger('click', {
        event: 'clicked',
        value: true,
        data: 'ZOOM_IN'
      });
    });

    buttonZoomOutDiv.addEventListener('click', () => {
      this._trigger('click', {
        event: 'clicked',
        value: true,
        data: 'ZOOM_OUT'
      });
    });
  }
}
