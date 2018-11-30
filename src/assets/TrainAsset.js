import { BaseAsset } from './BaseAsset';
import { getHTMLTrainIcon } from './TrainIcon';
import { TrainTooltip } from './TrainTooltip';

export class TrainAsset extends BaseAsset {
    constructor(args) {
        super(args);
        const data = args.data;

        this.assetCanMove = true;
        this.assetCanSelect = true;
        this.assetSelected = false;

        this.html = getHTMLTrainIcon(data, { angle: 20 });
        this.eventTrainDom();


    }

    eventTrainDom() {
        this.addListener('click', () => {
            console.log('clickkkk')
        })
        this.addListener('mouseenter', () => {
            console.log('mouseenter');

            this.openTooltip();
        })
        this.addListener('mouseout', () => {
            console.log('mouseout')
            this.closeTooltip();
        })
    }

    createTooltip() {
        const data = { assetName: 'ABC', list: [] }
        this.tooltip = new TrainTooltip(data);
    }

    openTooltip() {
        this.createTooltip();
        this.tooltip.open()
    }

    closeTooltip() {
        // this.tooltip.close()
    }
}
