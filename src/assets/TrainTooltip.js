import { BaseTooltip } from './BaseTooltip';

export class TrainTooltip extends BaseTooltip {
  constructor(args) {
    super(args);

    this.properties = args.properties;
    this.setContent(this.getHTML(this.properties));
  }

  getHTML(data) {
    const list = data.list;
    const htmlData = list.reduce((current, next) => {
      current +=
        '<li class="train-info-list-item"><div class="train-info-list-item-name">' +
        next.name +
        '</div><div class="train-info-list-item-value">' +
        next.value +
        '</div></li>';
      return current;
    }, '');

    const htmlTemplate =
      '<div class="train-info"><div class="train-info-inner"><div class="train-info-head"><span class="train-info-head-name"></span><span class="train-info-head-value">' +
      data.name +
      '</span></div><div class="train-info-body"><ul class="train-info-list"> ' +
      htmlData +
      ' </ul></div></div><div class="train-info-arrow"><div class="train-info-arrow-inner"></div></div></div>';

    return htmlTemplate;
  }
}
