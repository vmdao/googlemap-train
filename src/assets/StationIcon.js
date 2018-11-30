export function getHTMLStationIcon(data) {
    return getHTML(data);
}

function getHTML(data) {
    const imageUrl = 'assets/images/ic-marker-station.svg';
    var html =
        '<div class="enouvo-trains-station-asset"' +
        ' id="' +
        data.id +
        '"' +
        '"><div class="enouvo-trains-station-asset-om-name">' +
        data.name +
        '</div><img class="enouvo-trains-station-asset-om-img" src="' +
        imageUrl +
        '"></div>';

    return html;
}