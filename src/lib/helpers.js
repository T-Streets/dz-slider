export const q = (el, optionalEl) => {
    return optionalEl ? optionalEl.querySelector(el) : document.querySelector(el);
  };
  
  export const qa = (el, optionalEl) => {
    return optionalEl ? optionalEl.querySelectorAll(el) : document.querySelectorAll(el);
  };
  
  export const ael = (event, el, cb) => {
    el.addEventListener(event, cb);
  };
  
  export const styler = (elements, styles) => {
    elements.forEach(element => {
      Object.assign(element.style, styles);
    });
  };
  