export const GOOGLE_MAP_API = google.maps;

export function hasClass(elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

export function addClass(elem, className) {
  if (!hasClass(elem, className)) {
    elem.className += ' ' + className;
  }
}

export function removeClass(elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
}

export function toggleClass(elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  } else {
    elem.className += ' ' + className;
  }
}

export function getNewElement(args) {
  const element = document.createElement('div');
  if (args && args.className) {
    element.className = args.className;
  }
  if (args && args.html) {
    element.innerHTML = args.html;
    if (!args.className) {
      return element.firstChild;
    }
  }
  return element;
}

export function setHTML(container, content) {
  if (container) {
    // Clear out everything in the container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    if (content) {
      if (typeof content === 'string') {
        container.innerHTML = content;
      } else {
        container.appendChild(content);
      }
    }
  }
}

export function toLatLng(v) {
  if (v !== undefined && v !== null) {
    if (v instanceof GOOGLE_MAP_API.LatLng) {
      return v;
    } else if (v.lat !== undefined && v.lng !== undefined) {
      return new GOOGLE_MAP_API.LatLng(v);
    }
  }
  return null;
}
