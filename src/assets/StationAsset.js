import { BaseAsset } from './BaseAsset';
import { getHTMLStationIcon } from './StationIcon'
export class StationAsset extends BaseAsset {
    constructor(args) {
        super(args);
        const data = args.data;

        this.assetCanMove = false;
        this.assetCanSelect = false;
        this.assetSelected = false;

        this.html = getHTMLStationIcon(data);
    }
}
