import { q, qa, ael, styler } from './helpers';

const DZSlider = ({ element, styles, arrowOpts, dotOpts }) => {
  const slider = q(element);
  const innerWrapper = q('.dz-slider-inner', slider);
  const images = Array.from(qa('.dz-slider-inner > .slide', slider));
  console.log(images);

  styler([slider], styles);

  let state = {
    translateValue: 0,
    currentIndex: 0,
    currentSliderWidth: slider.clientWidth
  };

  const setState = args => {
    state = { ...state, ...args };
  };

  /**
   * Add the arrow elements and the dots container to the DOM first
   */
  const dotButtons = images.map(img => '<button class="dz-slider-dot"></button> ');
  const arrowsAndDots = document.createElement('div');
  arrowsAndDots.innerHTML = `<div class="dz-slider-arrow-left">
                                <img src="" />
                              </div>
                              <div class="dz-slider-arrow-right">
                                <img src="" />
                              </div>
                              <div class="dz-slider-dots-container">
                                ${dotButtons.join('')}
                              </div>`;

  const children = Array.from(arrowsAndDots.childNodes);

  children.forEach(child => {
    if (child.nodeName !== '#text') {
      slider.appendChild(child);
    }
  });

  /**
   * Now that the arrows and dots have been added, we can start targeting
   * them and setting the appropriate listeners, styles, etc.
   */
  const dotsContainer = q('.dz-slider > .dz-slider-dots-container');
  const dots = Array.from(qa('.dz-slider-dot', slider));

  styler([dotsContainer], { bottom: dotOpts.yPos });
  styler(dots, { ...dotOpts.styles, backgroundColor: dotOpts.baseColor });
  styler([dots[0]], { backgroundColor: dotOpts.activeColor });

  const leftArrow = q('.dz-slider-arrow-left > img', slider);
  leftArrow.setAttribute('src', arrowOpts.leftArrow.url);
  styler([leftArrow.parentElement], { left: arrowOpts.leftArrow.pos });

  const rightArrow = q('.dz-slider-arrow-right > img', slider);
  rightArrow.setAttribute('src', arrowOpts.rightArrow.url);
  styler([rightArrow.parentElement], { right: arrowOpts.rightArrow.pos });

  /**
   * Arrow functionality.
   */
  ael('click', leftArrow, () => {
    if (state.currentIndex === 0) {
      return;
    } else {
      setState({
        translateValue: state.translateValue + state.currentSliderWidth,
        currentIndex: state.currentIndex - 1
      });
      innerWrapper.style.transform = `translateX(${state.translateValue}px)`;
      selectActiveDot(state.currentIndex);
    }
  });

  ael('click', rightArrow, () => {
    if (state.currentIndex < images.length - 1) {
      setState({
        translateValue: state.translateValue - state.currentSliderWidth,
        currentIndex: state.currentIndex + 1
      });
      innerWrapper.style.transform = `translateX(${state.translateValue}px)`;
      selectActiveDot(state.currentIndex);
    } else {
      setState({ translateValue: 0, currentIndex: 0 });
      innerWrapper.style.transform = `translateX(0px)`;
      selectActiveDot(0);
    }
  });

  /**
   * Dot functionality.
   */
  const selectActiveDot = i => {
    dots.forEach(dot => {
      dot.style.backgroundColor = dotOpts.baseColor;
    });

    dots.forEach((dot, _i) => {
      if (i === _i) dot.style.backgroundColor = dotOpts.activeColor;
    });
  };

  dots.forEach((dot, i) => {
    ael('click', dot, () => {
      if (
        (i === 0 && state.currentIndex === 0) ||
        (i === images.length - 1 && state.currentIndex === images.length - 1)
      ) {
        return;
      } else {
        let numSlidesAway = 0;
        let newTranslateValue = 0;

        // Need to go forward
        if (state.currentIndex < i) {
          numSlidesAway = i - state.currentIndex;
          newTranslateValue = state.translateValue + -(numSlidesAway * state.currentSliderWidth);
        }
        // Need to go backward
        else {
          numSlidesAway = state.currentIndex - i;
        }

        setState({ currentIndex: i, translateValue: newTranslateValue });
        innerWrapper.style.transform = `translateX(${state.translateValue}px)`;
      }

      selectActiveDot(i);
    });
  });

  /**
   * Handle resize events
   */
  window.addEventListener('resize', () => {
    const currentSliderWidth = slider.clientWidth;

    // We are at the first slide and only want to get the new slider width. Do nothing else.
    if (state.currentIndex === 0) {
      return setState({ currentSliderWidth });
    }

    // The screen is shrinking in size.
    if (currentSliderWidth < state.currentSliderWidth) {
      const diff = state.currentSliderWidth - currentSliderWidth;
      const newTranslateValue = state.translateValue + diff;

      innerWrapper.style.transform = `translateX(${newTranslateValue}px)`;
      return setState({ currentSliderWidth, translateValue: newTranslateValue });
    }

    // The screen is growing in size.
    if (currentSliderWidth > state.currentSliderWidth) {
      const diff = currentSliderWidth - state.currentSliderWidth;
      const newTranslateValue = state.translateValue - diff;

      innerWrapper.style.transform = `translateX(${newTranslateValue}px)`;
      return setState({ currentSliderWidth, translateValue: newTranslateValue });
    }
  });
};

export default DZSlider;
