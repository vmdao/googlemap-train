import { BaseAsset } from './BaseAsset';
import { getHTMLTrainIcon } from './TrainIcon';
import { TrainTooltip } from './TrainTooltip';

export class TrainAsset extends BaseAsset {
  constructor(args) {
    super(args);
    this.properties = args.properties;

    this.assetCanMove = true;
    this.assetCanSelect = true;
    this.assetSelected = false;

    this.html = getHTMLTrainIcon(this.properties, { angle: 20 });
    this.eventTrainDom();
    this.createTooltip();
  }

  eventTrainDom() {
    this.addListener('click', () => {
      console.log('clickkkk');
      this.openTooltip();
    });
    this.addListener('mouseenter', () => {
      console.log('mouseenter');
      //   this.openTooltip();
    });
    this.addListener('mouseout', () => {
      console.log('mouseout');
      //   this.closeTooltip();
    });
  }

  createTooltip() {
    this.tooltip = new TrainTooltip({
      marker: this,
      properties: this.properties
    });
  }

  openTooltip() {
    this.tooltip.open();
  }

  closeTooltip() {
    this.tooltip.close();
  }
}
