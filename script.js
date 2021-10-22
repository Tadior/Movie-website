'use strict';

const apiKey = 'api_key=bc7f613ed0836462395fb99a14e9762f';
const baseUrl = 'https://api.themoviedb.org/3';
const urlApi = baseUrl + '/discover/movie?sort_by-popularity.desc&' + apiKey;
const searchUrl = baseUrl + '/search/movie?' + apiKey;
const genreApi = baseUrl + '/genre/movie/list?' + apiKey + '&language=ru-RU'
const search = document.querySelector('label');


async function getMovies(url) { // Запрос к серверу с получением фильмов
   const response = await fetch(url);
   const data = await response.json();
   return data.results;
}
//This function only used in function showMovie. We can not use it 
function createElement(data, counter) { //Создание нового элемента
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
         <img src="https://image.tmdb.org/t/p/w500${movieInfo.poster}" alt="" srcset="">
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
// Callback function
function showMovies(info) { // Добавление элемента на страницу
   let counter = 0;
   return (data = info) => {
      const movieContainer = document.querySelector('.movie-fluid');
      movieContainer.appendChild(createElement(data, counter));
      counter++;
   }
}

// Функция запускающай весь код
async function main() {
   let counter = 0;
   let data = await getMovies(urlApi);
   let showMovie = showMovies(data);
   for (let i = 0; i < 12; i++) {
      showMovie(data);
   }
   
}

main();

async function searchMovie(event) {

   const inputValue = document.querySelector('.search__input').value;
   let movieName = '';
   for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] == ' ') {
         movieName += '+';
         continue;
      }
      movieName += inputValue[i];
   }

   async function search() {
      const response = await fetch(`${searchUrl}&query=${movieName}`);
      const data = await response.json();
      return data.results;
   }

   const searchMovie = await search();
   if (searchMovie.length == 0) {
      document.querySelector('.movie-fluid').textContent = 'Фильм не найден';
   }
   let showMovie = showMovies(searchMovie);

   clearMovies();
   for (let i = 0; i < searchMovie.length; i++) {
      showMovie();
   }
}

function clearMovies() {
   document.querySelectorAll('.movie').forEach(element => element.remove());
}

search.addEventListener('click', searchMovie);

document.querySelector('.search').addEventListener('submit', function (event) {
   event.preventDefault();
   searchMovie()
});

async function genre(url) {
   async function getGenres(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data.genres;
   }
   const genre = await getGenres(url);
   console.log(genre)
   const genreFluid = document.querySelector('.genres');
   console.log(genreFluid)
   for (let key in genre) {
      genreFluid.innerHTML += `<div class='genre'>${genre[key].name}</div>`;
   }
}



genre(genreApi);

