export function getHTMLStationIcon(data) {
  return getHTML(data);
}

function getHTML(data) {
  const imageUrl = 'images/ic-marker-station.svg';
  const html =
    '<div class="station-asset"><div class="station-asset-om-name">' +
    data.name +
    '</div><img class="station-asset-om-img" src="' +
    imageUrl +
    '"></div>';

  return html;
}
