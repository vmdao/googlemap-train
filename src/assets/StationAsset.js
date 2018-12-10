import { BaseAsset } from './BaseAsset';
import { getHTMLStationIcon } from './StationIcon';
export class StationAsset extends BaseAsset {
  constructor(args) {
    super(args);
    this._prefix_event = 'station_asset_';

    this.assetCanMove = false;
    this.assetCanSelect = false;
    this.assetSelected = false;
    this._zIndex = 10;
    this.html = getHTMLStationIcon(this._properties);
  }

  _addEventsDom() {
    this._html.content.addEventListener('click', event => {
      this._trigger('click', {
        event: 'clicked',
        data: { type: 'station', value: this._properties }
      });
    });

    this._html.content.addEventListener('mouseenter', () => {});
    this._html.content.addEventListener('mouseout', () => {});
  }

  _onSelectedChangeTemplate() {
    addClass(this._html.content, 'train-asset-selected');
  }

  _onDeselectedChangeTemplate() {
    removeClass(this._html.content, 'train-asset-selected');
  }
}
