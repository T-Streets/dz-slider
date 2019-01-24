import DZSlider from '../lib/index';

window.addEventListener('DOMContentLoaded', () => {
  new DZSlider({
    element: '.testimonials.dz-slider',
    numSlidesPer: 1,
    baseStyles: {
      height: '300px'
    },
    arrowOpts: {
      activeColor: '#FFFFFF',
      leftArrow: {
        url: './gray-arrow-back.svg',
        pos: '10px'
      },
      rightArrow: {
        url: './gray-arrow-forward.svg',
        pos: '10px'
      }
    },
    dotOpts: {
      yPos: '5px',
      baseColor: '#333',
      activeColor: '#FFF',
      styles: {
        'border-radius': '50%',
        padding: '6px',
        'margin-right': '3px'
      }
    }
  });
});
