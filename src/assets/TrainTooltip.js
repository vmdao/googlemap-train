import { Tooltip } from './Tooltip';

export class TrainTooltip extends Tooltip {
    constructor(data) {
        super(data);
        this.html = this.getHTML(data);
    }

    getHTML(data) {
        const list = data.list
        const htmlData = list.reduce((current, next) => {
            current +=
                '<li class="leaflet-trains-popup-list-item"><div class="leaflet-trains-popup-list-item-name">' +
                next.name +
                '</div><div class="leaflet-trains-popup-list-item-value">' +
                next.value +
                '</div></li>';
            return current;
        }, '');

        const htmlTemplate =
            '<div class="leaflet-trains-popup"><div class="leaflet-trains-popup-wrapper"><div class="leaflet-trains-popup-head"><span class="leaflet-trains-popup-head-name"></span><span class="leaflet-trains-popup-head-value">' +
            data.assetName +
            '</span></div><div class="leaflet-trains-popup-body"><ul class="leaflet-trains-popup-list"> ' +
            htmlData +
            ' </ul></div></div></div>';
        return htmlTemplate;
    }
}
