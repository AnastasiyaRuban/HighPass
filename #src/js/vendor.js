//MAP
ymaps.ready(init);
function init() {
  let myMap = new ymaps.Map("map", {
    center: [55.758456, 37.626942],
    zoom: 13,
    controls: [],
  });
  let myPlacemark = new ymaps.Placemark([55.769535, 37.639985], {}, {
    iconLayout: 'default#image',
    iconImageHref: '../resources/map.svg',
    iconImageSize: [12, 12],




  });
  myMap.geoObjects.add(myPlacemark);
  myPlacemark.events.add('click', function () {
    let adress = document.querySelector('.adress')
    adress.classList.add('open')
});
}

//VALIDATE
@@include('just-validate3.3.3.min.js');

const validationAbout = new JustValidate('.about-us__form', {
  errorFieldCssClass: 'is-invalid',
  errorLabelStyle: {
    color: '#f06666',
  },
});
validationAbout
  .addField('.email-input-about', [
    {
      rule: 'required',
      errorMessage: 'Введите e-mail',
    },
    {
      rule: 'email',
      errorMessage: 'Недопустимый формат',
    },
  ])
  .onSuccess((event) => {
    console.log('Validation passes and form submitted', event);
    let formData = new FormData(event.target);
    console.log(...formData);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Отправлено');
        }
      }
    }
    xhr.open('POST', 'mail.php', true);
    xhr.send(formData);
    event.target.reset();
  });

  const validationContacts = new JustValidate('.callback__form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      color: '#FF3030',
    },
  });
  validationContacts
    .addField('.name-input', [
      {
        rule: 'customRegexp',
        value: /^[a-zA-Zа-яА-Яё]/,
        errorMessage: 'Недопустимый формат',
      },{
        rule: 'required',
        errorMessage: 'Введите ваше имя',
      },
    ])
    .addField('.email-input', [
      {
        rule: 'required',
        errorMessage: 'Введите e-mail',
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      },
    ])
    .onSuccess((event) => {
      console.log('Validation passes and form submitted', event);
      let formData = new FormData(event.target);
      console.log(...formData);
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('Отправлено');
          }
        }
      }
      xhr.open('POST', 'mail.php', true);
      xhr.send(formData);
      event.target.reset();
    });
  
