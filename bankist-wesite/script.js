'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach( btn => btn.addEventListener('click' , openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnToScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnToScroll.addEventListener('click' , () => {
  section1.scrollIntoView({behavior:'smooth'});
})

// Nav smooth scrolling

// document.querySelectorAll('.nav__link').forEach( btn => {
//   btn.addEventListener('click' , function (e){
//     e.preventDefault();
//     const sectionId = this.getAttribute('href'); 
//     document.querySelector(sectionId).scrollIntoView({behavior:'smooth'});
//   })
// })

// Using Events deligation
document.querySelector('.nav__links').addEventListener('click' , (e) => {
  e.preventDefault();

  if(e.target.classList.contains('nav__link')){
    const sectionId = e.target.getAttribute('href'); 
    document.querySelector(sectionId).scrollIntoView({behavior:'smooth'});
  }
})



// Tabbed Components
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const operationContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener( 'click' ,(e) => {
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return;

  tabs.forEach( btn => btn.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // display content
  operationContent.forEach( t => t.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})


const nav = document.querySelector('.nav');

// Menu fade animation
const handleHover = (e , opacity) => {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach( item => {
      if(item !== link)
        item.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  } 
}

nav.addEventListener('mouseover' , (e) => handleHover(e , 0.5) );
nav.addEventListener('mouseout' , (e) => handleHover(e , 1) );


// sticky nav bar
const obsCallBack = (entries , observer) => {
  entries.forEach( entry => {
    if(entry.intersectionRatio === 0) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  })
}
const obsOptions = {
  root : null,
  threshold : 0,
  rootMargin : '-90px'
}
const observer = new IntersectionObserver(obsCallBack , obsOptions);
observer.observe(document.querySelector('.header'));



// revel section on scroll
const allSection = document.querySelectorAll('.section');

const revelSection = (enteries , observer) => {
  // console.log(enteries);
  // console.log(enteries[0].target);
  if(enteries[0].isIntersecting)  {
    enteries[0].target.classList.remove('section--hidden');
    sectionObserver.unobserve(enteries[0].target);
  }  
}

const sectionObserver = new IntersectionObserver(revelSection , { root:null , threshold : 0.15});

allSection.forEach( section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
})

// Lazy image loading
const imageTargets  = document.querySelectorAll('img[data-src]');

const imageObs = (entries , observer ) => {
  if(entries[0].isIntersecting){
    // console.log(entries[0].target.dataset.src);
    entries[0].target.setAttribute("src" ,  entries[0].target.dataset.src); // set real image

    entries[0].target.addEventListener('load' , () => {
      entries[0].target.classList.remove('lazy-img'); // remove class from it
    })
    
    imgObserver.unobserve(entries[0].target); // unobserv element
  }
}

const imgObserver = new IntersectionObserver( imageObs , {root:null , threshold : 0 , rootMargin: '200px' /*observe before 200px*/ });

imageTargets.forEach( img => {
  imgObserver.observe(img);
})


// slider

const slides =  document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');

let currSlide = 0 , sliderLength = 3;

const gotoSlide = (slideIndex) => {
  slides.forEach( (slide , i) => {
    slide.style.transform = `translateX(${100*(i - slideIndex)}%)`;
  })
  
  document.querySelectorAll('.dots__dot').forEach( dot => {
    if(dot.dataset.slide == slideIndex) dot.classList.add('dots__dot--active');
    else if(dot.classList.contains('dots__dot--active')) dot.classList.remove('dots__dot--active');
  })

}

const creatDots = () => {
  slides.forEach( (_ , i) => {
    dots.insertAdjacentHTML('beforeend' , `<button class="dots__dot" data-slide="${i}"></button>`);
  })
}

const preSlide = () => {
  if(currSlide == 0 ) currSlide=sliderLength-1;
  else currSlide--;
  gotoSlide(currSlide);
}
const nextSlide = () => {
  if(currSlide == sliderLength - 1) currSlide=0;
  else currSlide++;
  gotoSlide(currSlide);
}
// Next slide
btnRight.addEventListener('click' , nextSlide);

// previous slide
btnLeft.addEventListener('click' , preSlide);

// for default settings
creatDots();
gotoSlide(0);

// dots click
dots.addEventListener('click' , e => {
  if(e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    gotoSlide(slide);
  }
})

// handle with keybord
document.addEventListener('keydown' , (e) => {
  if(e.key === 'ArrowRight') {
    nextSlide();
  }else if(e.key === 'ArrowLeft'){
    preSlide();
  }
})