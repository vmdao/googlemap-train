export function getHTMLTrainIcon(data, options) {
    return getHTML(data, options);
}

function getHTML(data, options) {

    const imageUrl = './images/ic-marker-train.svg';

    const arrowHtml =
        (options &&
            options.angle &&
            '<div class="enouvo-trains-train-asset-arrow arrow-es"><div class="train-arrow"><div class="train-arrow-after"></div></div></div>') ||
        '';

    const html =
        '<div class="enouvo-trains-train-asset"><div class="enouvo-trains-train-asset-om"><div class="enouvo-trains-train-asset-om-name">' +
        data.name +
        '</div><img class="enouvo-trains-train-asset-om-img" src="' +
        imageUrl +
        '"></div><div class="enouvo-trains-train-asset-or" style="transform: rotate(' +
        options.angle +
        'deg);">' +
        arrowHtml +
        '</div></div>';

    return html;
}