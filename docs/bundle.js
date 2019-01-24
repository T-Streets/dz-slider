!function(t){var e={};function r(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);var n=function(t,e){return e?e.querySelector(t):document.querySelector(t)},s=function(t,e){return e?e.querySelectorAll(t):document.querySelectorAll(t)},i=function(t,e,r){e.addEventListener(t,r)},o=function(t,e){t.forEach(function(t){Object.assign(t.style,e)})};function a(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),n.forEach(function(e){l(t,e,r[e])})}return t}function l(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function d(t){var e=this;this.state={translateValue:0,currentIndex:0,currentSliderWidth:n(t.element).clientWidth},this.options=a({numSlidesPer:1},t),this.slider=n(t.element),this.innerWrapper=n(".dz-slider-inner",this.slider),this.slides=Array.from(s(".dz-slider-inner > .slide",this.slider)),this.arrowsAndDots=document.createElement("div"),this.dotButtons,this.dotsContainer,this.dots,["handleNumberOfSlides","addArrowsAndDots","applyStyles","addArrowListeners","addDotListeners","addResizeListeners"].forEach(function(t){return e[t]()})}d.prototype.handleNumberOfSlides=function(){var t=this,e=this.options;if(e.numSlidesPer>1&&Number.isInteger(e.numSlidesPer)){this.slides.forEach(function(r){r.style.width="".concat(t.state.currentSliderWidth/e.numSlidesPer,"px")});var r=this.slides.slice(0,Math.ceil(this.slides.length/e.numSlidesPer));this.dotButtons=r.map(function(){return'<button class="dz-slider-dot"></button>'})}else this.dotButtons=this.slides.map(function(){return'<button class="dz-slider-dot"></button>'})},d.prototype.addArrowsAndDots=function(){var t=this;this.arrowsAndDots.innerHTML='<div class="dz-slider-arrow-left">\n                                    <img src="" />\n                                  </div>\n                                  <div class="dz-slider-arrow-right">\n                                    <img src="" />\n                                  </div>\n                                  <div class="dz-slider-dots-container">\n                                    '.concat(this.dotButtons.join(""),"\n                                  </div>"),Array.from(this.arrowsAndDots.childNodes).forEach(function(e){"#text"!==e.nodeName&&t.slider.appendChild(e)});var e=this.options.arrowOpts;this.leftArrow=n(".dz-slider-arrow-left > img",this.slider),this.leftArrow.setAttribute("src",e.leftArrow.url),this.rightArrow=n(".dz-slider-arrow-right > img",this.slider),this.rightArrow.setAttribute("src",e.rightArrow.url),this.dotsContainer=n(".dz-slider > .dz-slider-dots-container"),this.dots=Array.from(s(".dz-slider-dot",this.slider))},d.prototype.applyStyles=function(){var t=this.slider,e=this.dotsContainer,r=this.dots,n=this.leftArrow,s=this.rightArrow,i=this.options,l=i.baseStyles,d=i.dotOpts,c=i.arrowOpts;o([t],l),o([e],{bottom:d.yPos}),o(r,a({},d.styles,{backgroundColor:d.baseColor})),o([r[0]],{backgroundColor:d.activeColor}),o([n.parentElement],{left:c.leftArrow.pos}),o([s.parentElement],{right:c.rightArrow.pos})},d.prototype.addArrowListeners=function(){var t=this,e=this.leftArrow,r=this.rightArrow,n=this.innerWrapper,s=this.slides;i("click",e,function(){0!==t.state.currentIndex&&(t.setState({translateValue:t.state.translateValue+t.state.currentSliderWidth,currentIndex:t.state.currentIndex-1}),n.style.transform="translateX(".concat(t.state.translateValue,"px)"),t.selectActiveDot(t.state.currentIndex))}),i("click",r,function(){t.state.currentIndex<Math.ceil(s.length/t.options.numSlidesPer)-1?(t.setState({translateValue:t.state.translateValue-t.state.currentSliderWidth,currentIndex:t.state.currentIndex+1}),t.selectActiveDot(t.state.currentIndex),n.style.transform="translateX(".concat(t.state.translateValue,"px)")):(t.setState({translateValue:0,currentIndex:0}),t.selectActiveDot(0),n.style.transform="translateX(0px)")})},d.prototype.addDotListeners=function(){var t=this,e=this.dots,r=this.slides,n=this.innerWrapper;e.forEach(function(e,s){i("click",e,function(){if(!(0===s&&0===t.state.currentIndex||s===r.length-1&&t.state.currentIndex===r.length-1)){var e=0,i=0;t.state.currentIndex<s?(e=s-t.state.currentIndex,i=t.state.translateValue+-e*t.state.currentSliderWidth):e=t.state.currentIndex-s,t.setState({currentIndex:s,translateValue:i}),n.style.transform="translateX(".concat(t.state.translateValue,"px)"),t.selectActiveDot(s)}})})},d.prototype.addResizeListeners=function(){var t=this,e=this.slider,r=this.innerWrapper;window.addEventListener("resize",function(){var n=e.clientWidth;if(0===t.state.currentIndex)return t.setState({currentSliderWidth:n});if(n<t.state.currentSliderWidth){var s=t.state.currentSliderWidth-n,i=t.state.translateValue+s;return r.style.transform="translateX(".concat(i,"px)"),t.setState({currentSliderWidth:n,translateValue:i})}if(n>t.state.currentSliderWidth){var o=n-t.state.currentSliderWidth,a=t.state.translateValue-o;return r.style.transform="translateX(".concat(a,"px)"),t.setState({currentSliderWidth:n,translateValue:a})}})},d.prototype.selectActiveDot=function(t){var e=this.dots,r=this.options.dotOpts;e.forEach(function(t){t.style.backgroundColor=r.baseColor}),e.forEach(function(e,n){t===n&&(e.style.backgroundColor=r.activeColor)})},d.prototype.setState=function(t){this.state=a({},this.state,t)};var c=d;window.addEventListener("DOMContentLoaded",function(){new c({element:".testimonials.dz-slider",numSlidesPer:1,baseStyles:{height:"300px"},arrowOpts:{activeColor:"#FFFFFF",leftArrow:{url:"./gray-arrow-back.svg",pos:"10px"},rightArrow:{url:"./gray-arrow-forward.svg",pos:"10px"}},dotOpts:{yPos:"5px",baseColor:"#333",activeColor:"#FFF",styles:{"border-radius":"50%",padding:"6px","margin-right":"3px"}}})})}]);