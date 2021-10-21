'use strict';

const apiKey = 'api_key=bc7f613ed0836462395fb99a14e9762f';
const baseUrl = 'https://api.themoviedb.org/3';
const urlApi = baseUrl + '/discover/movie?sort_by-popularity.desc&' + apiKey;

async function getMovies(url) { // Запрос к серверу с получением фильмов
   const response = await fetch(url);
   const data = await response.json();
   return data.results;
}

function createElement(data, counter) { //Создание нового элемента
   console.log(data)
      const movieInfo = {
         picture: data[counter].backdrop_path,
         title: data[counter].original_title,
         overview: data[counter].overview,
         rating: data[counter].vote_average,
         poster: data[counter].poster_path
      };
      const movieBody = document.createElement('div');
      movieBody.classList.add('movie');
      movieBody.innerHTML = 
      `
         <img src="https://image.tmdb.org/t/p/w500${movieInfo.picture}" alt="" srcset="">
         <div class="movie__info">
            <div class="movie__name">${movieInfo.title}</div>
            <div class="movie__rating">${movieInfo.rating}</div>
         </div>
         <div class="movie__overview">
            ${movieInfo.overview}
         </div>
      `
      return movieBody;
}

function showMovies(info) { // Добавление элемента на страницу
   let counter = 0;
   return (data = info) => {
      const movieContainer = document.querySelector('.movie-fluid');
      movieContainer.appendChild(createElement(data, counter));
      counter++;
      console.log(counter)
   }
}

// Функция запускающай весь код
async function main() {
   let counter = 0;
   let data = await getMovies(urlApi);
   createElement(data,counter);
   let showMovie = showMovies(data);

   for (let i = 0; i < 12; i++) {
      showMovie(data);
   }
}

main();
