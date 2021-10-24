'use strict';

const apiKey = 'api_key=bc7f613ed0836462395fb99a14e9762f';
const baseUrl = 'https://api.themoviedb.org/3';
let currentLanguage = 'ru-RU';
const urlApi = baseUrl + '/discover/movie?sort_by-popularity.desc&' + apiKey + `&language=${currentLanguage}`;
const searchUrl = baseUrl + '/search/movie?' + apiKey + `&language=${currentLanguage}`;
const genreApi = baseUrl + '/genre/movie/list?' + apiKey + `&language=${currentLanguage}`;
const genreUrl = baseUrl + '/discover/movie?' + apiKey + `&language=${currentLanguage}` + '&with_genres=18&with_genres=14';
const searchButton = document.querySelector('label');


async function getMovies(url) { // Запрос к серверу с получением фильмов
   const response = await fetch(url);
   const data = await response.json();
   return data.results;
}

// Callback function
function showMovies(info) { // Добавление элемента на страницу
   let counter = 0;
   return (data = info) => {

      //This function only used in function showMovie. We can not use it 
      function createElement(data) { //Создание нового элемента
         const movieInfo = {
            picture: data[counter].backdrop_path,
            title: data[counter].title,
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
         `;
         return movieBody;
      }

      const movieContainer = document.querySelector('.movie-fluid');
      movieContainer.appendChild(createElement(data, counter));
      counter++;
   };
}

// Функция запускающай весь код
async function main() {
   let counter = 0;
   let data = await getMovies(urlApi);
   let showMovie = showMovies(data);
   for (let i = 0; i < data.length; i++) {
      showMovie(data);
   }
   
}

main();
// searching by title
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
   let showMovie = showMovies(searchMovie);

   clearMovies();
   for (let i = 0; i < searchMovie.length; i++) {
      showMovie();
   }
}
// clear document of all movie
function clearMovies() {
   document.querySelectorAll('.movie').forEach(element => element.remove());
}

searchButton.addEventListener('click', searchMovie);

document.querySelector('.search').addEventListener('submit', function (event) {
   event.preventDefault();
   searchMovie();
});
// Search by genres
async function showGenre(url) {
   async function getGenres(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data.genres;
   }

   const genre = await getGenres(url);
   const genreFluid = document.querySelector('.genres');

   for (let key in genre) {
      genreFluid.innerHTML += `<div class='genre' data-genre=${genre[key].id}>${genre[key].name}</div>`;
   }

   const allGenres = document.querySelectorAll('.genre');

   async function searchByGenres() {
      let searchString = '';
      const genresActive = document.querySelectorAll('.genre--active');
      genresActive.forEach(element => {
         const id = element.getAttribute('data-genre');
         searchString +=`&with_genres=${id}`;
      });
      async function getMovie(url) {
         const response = await fetch(url);
         const data = await response.json();
         return data.results;
      }
      const data = await getMovie(genreUrl + searchString);
      clearMovies();
      const showMoviesFunc = showMovies(data);
      for (let i = 0; i < data.length; i++) {
         showMoviesFunc();
      }

   }

   allGenres.forEach(element => {
      element.addEventListener('click', () => {
         element.classList.toggle('genre--active');
         searchByGenres();
      });
   });
}

showGenre(genreApi);


const prevPage = document.querySelector('.page--previous');
const nextPage = document.querySelector('.page--next');
const currentPage = document.querySelector('.page--current');
prevPage.addEventListener('click', pagination);
nextPage.addEventListener('click', pagination);

async function pagination() {
   if(currentPage.textContent === '1' && this.classList.contains('page--previous')) {
      return false;
   }
   let pageCounter = +currentPage.textContent
   if (this.classList.contains('page--previous')) {
      pageCounter = pageCounter - 1;
   } else {
      pageCounter = pageCounter + 1;
   }
   async function getData(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data.results;
   }
   const data = await getData(urlApi + `&page=${pageCounter}`)
   clearMovies();
   const showMovie = showMovies(data);
   for (let i = 0; i < data.length; i++) {
      showMovie();
   }
   currentPage.textContent = pageCounter;
}

