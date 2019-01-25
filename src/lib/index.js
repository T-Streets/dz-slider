import { q, qa, ael, styler } from './helpers';

function DZSlider(options) {
  this.state = {
    translateValue: 0,
    currentIndex: 0,
    currentSliderWidth: q(options.element).clientWidth
  };

  this.options = {
    numSlidesPer: 1,
    ...options
  };

  this.slider = q(options.element);
  this.innerWrapper = q('.dz-slider-inner', this.slider);
  this.slides = Array.from(qa('.dz-slider-inner > .slide', this.slider));
  this.arrowsAndDots = document.createElement('div');
  this.dotButtons;
  this.dotsContainer;
  this.dots;

  [
    'handleNumberOfSlides',
    'addArrowsAndDots',
    'applyStyles',
    'addArrowListeners',
    'addDotListeners',
    'addResizeListeners'
  ].forEach(fn => this[fn]());
}

/**
 * Need to handle setting the width of the slides based on config options.
 * By default, a slide is obviously 100% of the width of the slider.
 */
DZSlider.prototype.handleNumberOfSlides = function handleNumberOfSlides() {
  const { options } = this;

  if (options.numSlidesPer > 1 && Number.isInteger(options.numSlidesPer)) {
    this.slides.forEach(slide => {
      slide.style.width = `${this.state.currentSliderWidth / options.numSlidesPer}px`;
    });

    const slicedslides = this.slides.slice(0, Math.ceil(this.slides.length / options.numSlidesPer));
    this.dotButtons = slicedslides.map(() => '<button class="dz-slider-dot"></button>');
  } else {
    this.dotButtons = this.slides.map(() => '<button class="dz-slider-dot"></button>');
  }
};

/**
 * Add the arrows and dots to the DOM, and add them as member variables
 */
DZSlider.prototype.addArrowsAndDots = function addArrowsAndDots() {
  this.arrowsAndDots.innerHTML = `<div class="dz-slider-arrow-left">
                                    <img src="" />
                                  </div>
                                  <div class="dz-slider-arrow-right">
                                    <img src="" />
                                  </div>
                                  <div class="dz-slider-dots-container">
                                    ${this.dotButtons.join('')}
                                  </div>`;

  const children = Array.from(this.arrowsAndDots.childNodes);

  children.forEach(child => {
    if (child.nodeName !== '#text') {
      this.slider.appendChild(child);
    }
  });

  const { arrowOpts } = this.options;

  this.leftArrow = q('.dz-slider-arrow-left > img', this.slider);
  this.leftArrow.setAttribute('src', arrowOpts.leftArrow.url);

  this.rightArrow = q('.dz-slider-arrow-right > img', this.slider);
  this.rightArrow.setAttribute('src', arrowOpts.rightArrow.url);

  this.dotsContainer = q('.dz-slider > .dz-slider-dots-container');
  this.dots = Array.from(qa('.dz-slider-dot', this.slider));
};

/**
 * Applies styles to all of the elements
 */
DZSlider.prototype.applyStyles = function applyStyles() {
  const {
    slider,
    dotsContainer,
    dots,
    leftArrow,
    rightArrow,
    options: { baseStyles, dotOpts, arrowOpts }
  } = this;

  styler([slider], baseStyles);

  styler([dotsContainer], { bottom: dotOpts.yPos });
  styler(dots, { ...dotOpts.styles, backgroundColor: dotOpts.baseColor });
  styler([dots[0]], { backgroundColor: dotOpts.activeColor });

  styler([leftArrow.parentElement], { left: arrowOpts.leftArrow.pos });
  styler([rightArrow.parentElement], { right: arrowOpts.rightArrow.pos });
};

/**
 * Adds click events listeners for left and right arrows.
 */
DZSlider.prototype.addArrowListeners = function addArrowListeners() {
  const { leftArrow, rightArrow, innerWrapper, slides } = this;

  ael('click', leftArrow, () => {
    if (this.state.currentIndex === 0) {
      return;
    } else {
      this.setState({
        translateValue: this.state.translateValue + this.state.currentSliderWidth,
        currentIndex: this.state.currentIndex - 1
      });

      innerWrapper.style.transform = `translateX(${this.state.translateValue}px)`;
      this.selectActiveDot(this.state.currentIndex);
    }
  });

  ael('click', rightArrow, () => {
    let slideRatio = Math.ceil(slides.length / this.options.numSlidesPer) - 1 

    console.log(slideRatio)
    if (this.state.currentIndex < slideRatio) {
        if(this.options.numSlidesPer === 1) {
        this.setState({
          translateValue: (this.state.translateValue - this.state.currentSliderWidth),
          currentIndex: this.state.currentIndex + 1
        });
      }
      else if(this.state.currentIndex === slideRatio - 1) {
        if(this.options.numSlidesPer % 2 === 1) {
          console.log('fired')
          this.setState({
            translateValue: (this.state.translateValue - this.state.currentSliderWidth) / 1.5,
            currentIndex: this.state.currentIndex + 1
          }); 
        } else if (this.options.numSlidesPer % 2 === 0) {
          console.log('fire2')
          this.setState({
            translateValue: (this.state.translateValue - this.state.currentSliderWidth) / 4,
            currentIndex: this.state.currentIndex + 1
          })
        } 
      } 

      this.setState({
        translateValue: (this.state.translateValue - this.state.currentSliderWidth),
        currentIndex: this.state.currentIndex + 1
      });
  

      this.selectActiveDot(this.state.currentIndex);
      innerWrapper.style.transform = `translateX(${this.state.translateValue}px)`;
    } else {
      this.setState({ translateValue: 0, currentIndex: 0 });
      this.selectActiveDot(0);
      innerWrapper.style.transform = `translateX(0px)`;
    }
  });
};

DZSlider.prototype.addDotListeners = function addDotListeners() {
  const { dots, slides, innerWrapper } = this;

  dots.forEach((dot, i) => {
    ael('click', dot, () => {
      if (
        (i === 0 && this.state.currentIndex === 0) ||
        (i === slides.length - 1 && this.state.currentIndex === slides.length - 1)
      ) {
        return;
      } else {
        let numSlidesAway = 0;
        let newTranslateValue = 0;

        // Need to go forward
        if (this.state.currentIndex < i) {
          numSlidesAway = i - this.state.currentIndex;
          newTranslateValue =
            this.state.translateValue + -(numSlidesAway * this.state.currentSliderWidth);
        }
        // Need to go backward
        else {
          numSlidesAway = this.state.currentIndex - i;
          newTranslateValue = 
            this.state.translateValue + (numSlidesAway * this.state.currentSliderWidth)
        }

        this.setState({ currentIndex: i, translateValue: newTranslateValue });
        innerWrapper.style.transform = `translateX(${this.state.translateValue}px)`;
      }

      this.selectActiveDot(i);
    });
  });
};

DZSlider.prototype.addResizeListeners = function addResizeListeners() {
  const { slider, innerWrapper } = this;

  window.addEventListener('resize', () => {
    const currentSliderWidth = slider.clientWidth;

    // We are at the first slide and only want to get the new slider width. Do nothing else.
    if (this.state.currentIndex === 0) {
      return this.setState({ currentSliderWidth });
    }

    // The screen is shrinking in size.
    if (currentSliderWidth < this.state.currentSliderWidth) {
      const diff = this.state.currentSliderWidth - currentSliderWidth;
      const newTranslateValue = this.state.translateValue + diff;

      innerWrapper.style.transform = `translateX(${newTranslateValue}px)`;
      return this.setState({ currentSliderWidth, translateValue: newTranslateValue });
    }

    // The screen is growing in size.
    if (currentSliderWidth > this.state.currentSliderWidth) {
      const diff = currentSliderWidth - this.state.currentSliderWidth;
      const newTranslateValue = this.state.translateValue - diff;

      innerWrapper.style.transform = `translateX(${newTranslateValue}px)`;
      return this.setState({ currentSliderWidth, translateValue: newTranslateValue });
    }
  });
};

/**
 * Changes the clicked dots color to active, and removes active color from all others just in case.
 */
DZSlider.prototype.selectActiveDot = function selectActiveDot(i) {
  const {
    dots,
    options: { dotOpts }
  } = this;

  dots.forEach(dot => {
    dot.style.backgroundColor = dotOpts.baseColor;
  });

  dots.forEach((dot, _i) => {
    if (i === _i) dot.style.backgroundColor = dotOpts.activeColor;
  });
};

DZSlider.prototype.setState = function setState(args) {
  this.state = { ...this.state, ...args };

  if (process.env.NODE_ENV === 'development') {
    console.log(this.state)
  }
};

export default DZSlider;
