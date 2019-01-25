import { q, qa, ael, styler } from './helpers';

/**
 * Constructor
 * @param {object} options the user has the ability to supply options that change the functionality of the slider.
 */
function DZSlider(options) {
  this.state = {
    translateValue: 0,
    currentIndex: 0,
    currentSliderWidth: q(options.element).clientWidth
  };

  console.log(this.state);
  // Merge default options and options supplied by user.
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

  // Execute all of the methods necessary to bootstrap the slider.
  ['determineSlidesPerView', 'addElementsToDOM', 'applyStyles', 'addEventListeners'].forEach(fn =>
    this[fn]()
  );
}

/**
 * Check to see how many slides per view the user wants. If they dont explicitly use that option,
 * it is default 1 slide per view. This also creates the dot buttons html elements and adds them as
 * a member variable.
 *
 * If the number of slides is more than 1 per view, we need to get the current width of the slider,
 * and divide that by the number of slides per view. This will yield the amount we need to set as the width
 * of each slide.
 *
 * Example:
 * Slider width: 700px with 2 slides per view.
 * 700 / 2 = 350. So we set every slide to be of width 350px.
 */
DZSlider.prototype.determineSlidesPerView = function determineSlidesPerView() {
  const { options, slides } = this;

  if (options.numSlidesPer > 1 && Number.isInteger(options.numSlidesPer)) {
    slides.forEach(slide => {
      slide.style.width = `${this.state.currentSliderWidth / options.numSlidesPer}px`;
    });

    const slicedslides = slides.slice(0, Math.ceil(slides.length / options.numSlidesPer));
    this.dotButtons = slicedslides.map(
      (slide, i) => `<button class="dz-slider-dot" data-index=${i}></button>`
    );
  } else {
    this.dotButtons = this.slides.map(
      (slide, i) => `<button class="dz-slider-dot" data-index=${i}></button>`
    );
  }
};

/**
 * Add any elements to the DOM that need to be there that arent supplied by the user.
 */
DZSlider.prototype.addElementsToDOM = function addElementsToDOM() {
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

  // Now that the arrows and dot related elements are added to the DOM, we set them as member variables
  // so we can access them throughout the prototype methods if we need to.
  this.leftArrow = q('.dz-slider-arrow-left > img', this.slider);
  this.rightArrow = q('.dz-slider-arrow-right > img', this.slider);
  this.dotsContainer = q('.dz-slider > .dz-slider-dots-container');
  this.dots = Array.from(qa('.dz-slider-dot', this.slider));

  // Set the src attribute of the img tags inside of the slider elements to show the arrows
  this.leftArrow.setAttribute('src', arrowOpts.leftArrow.url);
  this.rightArrow.setAttribute('src', arrowOpts.rightArrow.url);
};

/**
 * Go to previous slides, aka increase the translate value.
 * Ex: Current slide width: 700, Current translateValue: -1400
 * We would do: -1400 + 700 to yield us -700px.
 */
DZSlider.prototype.goBack = function goBack() {
  if (this.state.currentIndex > 0) {
    this.setState({
      translateValue: this.state.translateValue + this.state.currentSliderWidth,
      currentIndex: this.state.currentIndex - 1
    });
    this.innerWrapper.style.transform = `translateX(${this.state.translateValue}px)`;
    this.selectActiveDot(this.state.currentIndex);
  }
};

/**
 * Go to slides ahead of us, aka decrease the translate value.
 * Ex: Current slide width: 700, Current translateValue: 700
 * We would do: 700 - 700 to yield us 0px.
 */
DZSlider.prototype.goForward = function goForward() {
  if (this.state.currentIndex < Math.ceil(this.slides.length / this.options.numSlidesPer) - 1) {
    this.setState({
      translateValue: this.state.translateValue - this.state.currentSliderWidth,
      currentIndex: this.state.currentIndex + 1
    });

    this.selectActiveDot(this.state.currentIndex);
    this.innerWrapper.style.transform = `translateX(${this.state.translateValue}px)`;
  } else {
    this.setState({ translateValue: 0, currentIndex: 0 });
    this.selectActiveDot(0);
    this.innerWrapper.style.transform = `translateX(0px)`;
  }
};

/**
 * Handles the user clicking a dot
 */
DZSlider.prototype.handleDotClick = function handleDotClick(e) {
  const { slides, innerWrapper } = this;
  const i = parseInt(e.target.getAttribute('data-index'));

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
      newTranslateValue = this.state.translateValue + numSlidesAway * this.state.currentSliderWidth;
    }

    this.setState({ currentIndex: i, translateValue: newTranslateValue });
    innerWrapper.style.transform = `translateX(${this.state.translateValue}px)`;
  }

  this.selectActiveDot(i);
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

/**
 * Handles making sure that the slider adapts to the user changing the size of the screen
 */
DZSlider.prototype.handleResize = function handleResize() {
  const { slider, innerWrapper } = this;
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
};

/**
 * Applies styles to all of the elements. Not a huge fan of the styler function.
 * Maybe there is a more elegant way to set the styles here.
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
 * Abstracts the setting of listeners from the logic to make things easier to reason about in the callbacks
 */
DZSlider.prototype.addEventListeners = function addEventListeners() {
  ael('click', this.leftArrow, this.goBack.bind(this));
  ael('click', this.rightArrow, this.goForward.bind(this));
  ael('resize', window, this.handleResize.bind(this));
  this.dots.forEach(dot => ael('click', dot, this.handleDotClick.bind(this)));
};

/**
 * Updates the state without mutating its current state.
 */
DZSlider.prototype.setState = function setState(args) {
  this.state = { ...this.state, ...args };

  if (process.env.NODE_ENV === 'development') {
    console.log(this.state);
  }
};

export default DZSlider;
