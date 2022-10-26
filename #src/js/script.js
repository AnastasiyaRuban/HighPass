@@include('vendor.js')

// GENERAL
let searchTrigger = document.querySelector('.header__search');
let searchIcon = document.querySelector('.search__icon');
let searchInput = document.querySelector('.search__input');
let searchCloseIcon = document.querySelector('.search__close');
let burger = document.querySelector('.burger');
let menu = document.querySelector('.menu');
let menuLink = document.querySelectorAll('.nav__item');
let searchForm = document.querySelector('.search');
let links = document.querySelectorAll('a[href^="#"]');
let closeAdress = document.querySelector('.adress__close');
let adress = document.querySelector('.adress')
let topOffset = 50;

links.forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    let href = this.getAttribute('href').slice(1);
    const targetElem = document.getElementById(href);
    const elemPosition = targetElem.getBoundingClientRect().top;
    const offsetPosition = elemPosition - topOffset;
    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

//ADRESS
closeAdress.addEventListener('click', function () {
  adress.classList.remove('open')
})

// SEARCH
searchTrigger.addEventListener('click', function (e) {
  e.preventDefault();
  searchOpen();
})

searchCloseIcon.addEventListener('click', function (el) {
  el.preventDefault();
  searchClose();
})

searchInput.oninput = function () {
  searchInput.classList.add('write')
}

const searchOpen = () => {
  searchTrigger.classList.add('opac0');
  searchIcon.classList.add('active');
  searchInput.classList.add('active');
  searchForm.classList.add('active');
  searchCloseIcon.classList.add('active');
}
const searchClose = () => {
  searchTrigger.classList.remove('opac0');
  searchInput.classList.remove('active');

  setTimeout(() => {
    searchIcon.classList.remove('active');
    searchForm.classList.remove('active');
    searchCloseIcon.classList.remove('active');
  }, 300);

}

document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    searchClose();
  }
})

window.addEventListener('click', e => {
  const target = e.target
  if (!target.closest('.search') && !target.closest('.header__search')
    && !target.closest('.burger')) {
    searchClose();
    menuClose();
  }
})


// MENU
burger.onclick = () => {
  menuOpen()
}
const menuOpen = () => {
  menu.classList.toggle('open')
  burger.classList.toggle('open')
  document.body.classList.toggle('scroll')
}
const menuClose = () => {
  menu.classList.remove('open')
  burger.classList.remove('open')
  document.body.classList.remove('scroll')

}