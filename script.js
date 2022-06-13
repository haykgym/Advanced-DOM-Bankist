'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll X/Y', window.pageXOffset, window.pageYOffset);
  console.log(
    'height, width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top:  s1coords.top + window.pageYOffset,
  //   behavior: 'smooth';
  // })

  section1.scrollIntoView({ behavior: 'smooth' });
});

//scrolling navigation bar

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Add active
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation
// const initalCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initalCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation : Intersection observer API
//for practice
// const callback = function(entries, observer){
//   entries.forEach(entry =>{
//     console.log(entry);
//   })
// }

// const obsOpstions = {
//   root: null,
//   threshold : 0.2
// }

// const observer = new IntersectionObserver(callback,obsOpstions);
// observer.observe(section1);

//for project

const header = document.querySelector('.header');
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});

headerObserver.observe(header);

//Reveal sections

const allSections = document.querySelectorAll('section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//slider component

const slider = function () {
  let curSlide = 0;

  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goSlide = function (s) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - s)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === slides.length - 1) curSlide = 0;
    else curSlide++;

    goSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = slides.length - 1;
    else curSlide--;

    goSlide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    createDots();
    activateDots(0);
    goSlide(0);
  };
  init();

  //Eventhandlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goSlide(slide);
      activateDots(slide);
    }
  });
};
slider();

////// LECTURES
// Select DOM Elements

// const header = document.querySelector('.header');

//  .getElemmentById('button'),getElementsByTagName, getElementsByClassName

// create elements
//.insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');

// message.textContent = 'We use cookies for improved functionality and analitycs';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie"> Got It</button>';

// header.prepend(message);
// header.append(message);
// header.before(message);
// header.after(message);

//Delete elements

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });

//Styles

// message.style.color = '#5876d';
// message.style.width = '120%';

// console.log(getComputedStyle(message).height);

// message.style.height = +parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// document.documentElement.style.setProperty('class--', 'blueexapmple')

//Atributes

// const logo = document.querySelector('.nav__logo');

// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className); -- and not logo.class

//not standart
// console.log(logo.designer) would not Work
// console.log(logo.getAttribute('designer')) - will work
// logo.setAttribute('company', 'Bankist') - new attr

//Data atributes

// console.log(logo.dataset.versionNumber) -- .dataset.theRestInCammelCase

//classes

// logo.classList.add('c')
// logo.classList.remove('c')
// logo.classList.toggle('c')
// logo.classList.contains('c')

//DOM Traversing

// const h1 = document.querySelector('h1');

// console.log(h1.querySelector('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.parentElement);

// h1.firstElementChild.style.color = 'white';

// h1.closest(".header").style.background = 'vfv'

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el !== h1){
//     el.style.transform = 'scale(0.5)';
//   }
// })

//
// window.addEventListener('beforeunload',function(e){
//   e.preventDefault();
//   e.returnValue = ''
// })
