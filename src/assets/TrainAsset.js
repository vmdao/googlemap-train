import { BaseAsset } from './BaseAsset';
import { getHTMLTrainIcon } from './TrainIcon';
import { TrainTooltip } from './TrainTooltip';
import { addClass, removeClass } from '../libs';

export class TrainAsset extends BaseAsset {
  constructor(args) {
    super(args);
    this._prefix_event = 'train_asset_';
    this.assetCanMove = true;
    this.assetCanSelect = true;
    this.assetSelected = false;
    this._zIndex = 100;

    this.html = getHTMLTrainIcon(this.properties, { angle: 20 });

    this._createTooltip();
  }

  _addEventsDom() {
    this._html.content.addEventListener('click', event => {
      this._toggleSelected();
      this._trigger('click', {
        event: 'clicked',
        data: { type: 'train', value: this.properties }
      });
    });

    this._html.content.addEventListener('mouseenter', () => {
      this._openTooltip();
    });
    this._html.content.addEventListener('mouseout', () => {
      this._closeTooltip();
    });
  }

  _createTooltip() {
    this.tooltip = new TrainTooltip({
      marker: this,
      properties: this.properties
    });
  }

  _openTooltip() {
    this.tooltip.open();
  }

  _closeTooltip() {
    this.tooltip.close();
  }

  _onSelectedChangeTemplate() {
    addClass(this._html.content, 'train-asset-selected');
  }

  _onDeselectedChangeTemplate() {
    removeClass(this._html.content, 'train-asset-selected');
  }
}
