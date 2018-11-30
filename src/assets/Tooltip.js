export class Tooltip extends google.maps.OverlayView {
    constructor() {
        super();
    }

    createDiv() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.className = 'enouvo-trains-tooltip';

        if (this.html) {
            this.div.innerHTML = this.html;
        }
        this.eventDom();
    }

    eventDom() {
        google.maps.event.addDomListener(this.div, 'click', event => {
            google.maps.event.trigger(this, 'click');
        });

        google.maps.event.addDomListener(this.div, 'mouseenter', event => {
            google.maps.event.trigger(this, 'mouseenter');
        });

        google.maps.event.addDomListener(this.div, 'mouseout', event => {
            google.maps.event.trigger(this, 'mouseout');
        });
    }

    appendDivToOverlay() {
        const panes = this.getPanes();
        if (panes) {
            panes.floatPane.appendChild(this.div);
        }
    }

    draw() {

        if (!this.div) {
            this.createDiv();
            this.appendDivToOverlay();
        }
    }

    remove() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }

    open(map, anchor) {
        window.setTimeout(() => {
            this.open_(map, anchor);
        }, 0);
    }

    open_(opt_map, opt_anchor) {
        if (opt_map) {
            console.log(this, 12)
            this.setMap(opt_map);
        }

        if (opt_anchor) {
            this.set('anchor', opt_anchor);
            this.bindTo('anchorPoint', opt_anchor);
            this.bindTo('position', opt_anchor);
        }
        this.redraw_();
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
        this.remove();
    }

    htmlToDocumentFragment_(htmlString) {
        htmlString = htmlString.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
        var tempDiv = document.createElement('DIV');
        tempDiv.innerHTML = htmlString;
        if (tempDiv.childNodes.length == 1) {
            return (tempDiv.removeChild(tempDiv.firstChild));
        } else {
            var fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            return fragment;
        }
    }

    redraw_() {
        this.draw();
    };

    getContent() {
        return this.html;
    }
}
