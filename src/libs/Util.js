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
