if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .catch(error => {
      console.error(error);
    });
}

const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
//guarda el localStorage la URL de la siguiente petición
const almacenaje = window.localStorage;
//utiliza el nombre para la llave: 'next-fetch'
if (almacenaje.getItem('next_fetch')) {
  almacenaje.removeItem('next_fetch')
}

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      //problema opcional implementa mensaje
      if (!response.info.next) {
        intersectionObserver.disconnect()

        let output = `No hay personajes`
        let newItem = document.createElement('p')
        newItem.classList.add('Salida')
        newItem.innerText = salida
        $app.appendChild(newItem)

        return
      }

      //Obtiene los datos almacenados el localStorage de la llave 'next-fetch'
      almacenaje.setItem('next_fech', response.info.next)

      const characters = response.results;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}


//Actualiza la función loadData() a Async/Await
const loadData = async () => {
  if (!almacenaje.getItem('next_fetch')) {
    await getData(API);
    return;
  }

  await getData(almacenaje.getItem('next_fetch'));
}



const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);