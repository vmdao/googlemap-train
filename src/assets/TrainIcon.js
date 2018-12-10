export function getHTMLTrainIcon(data, options) {
  return getHTML(data, options);
}

function getHTML(data, options) {
  const imageUrl = './images/ic-marker-train.svg';

  const arrowHtml =
    (options &&
      options.angle &&
      '<div class="train-asset-or-arrow arrow-es"><div class="train-asset-or-arrow-inner"></div></div>') ||
    '';

  const html =
    '<div class="train-asset"><div class="train-asset-om"><div class="train-asset-om-name">' +
    data.name +
    '</div><img class="train-asset-om-img" src="' +
    imageUrl +
    '"></div><div class="train-asset-or" style="transform: rotate(' +
    options.angle +
    'deg);">' +
    arrowHtml +
    '</div></div>';

  return html;
}
