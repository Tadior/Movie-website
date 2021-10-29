'use strict';

const apiKey = 'api_key=bc7f613ed0836462395fb99a14e9762f';
const baseUrl = 'https://api.themoviedb.org/3';
let currentLanguage = 'ru-RU';
const urlApi = baseUrl + '/discover/movie?sort_by-popularity.desc&' + apiKey + `&language=${currentLanguage}`;
const searchUrl = baseUrl + '/search/movie?' + apiKey + `&language=${currentLanguage}`;
const genreApi = baseUrl + '/genre/movie/list?' + apiKey + `&language=${currentLanguage}`;
const genreUrl = baseUrl + '/discover/movie?' + apiKey + `&language=${currentLanguage}` + '&with_genres=18&with_genres=14';
const searchButton = document.querySelector('label');
const genres = document.querySelector('.genres')
let lastUrl = '';
let currentPage = 1;
let nextPage = 2;
let prevPage = 0;
let totalPages = 100;


async function getMovies(url) { // Запрос к серверу с получением фильмов
   lastUrl = url;
   const response = await fetch(url);
   const data = await response.json();
   if (data.results.length !== 0) {
      clearMovies();
      const showFilms = showMovies();
      showFilms(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;

      current.innerText = currentPage;
      if (currentPage <= 1) {
         prev.classList.add('disable');
         next.classList.remove('disable');
      } else if (currentPage >= totalPages) {
         prev.classList.remove('disable');
         next.classList.add('disable');
      } else {
         prev.classList.remove('disable');
         next.classList.remove('disable');
      }
      genres.scrollIntoView({behavior: 'smooth'})
   }
}
getMovies(urlApi)

// Callback function которая создает и добавляет новые элементы с фильмами на страницу
function showMovies(info) { // Добавление элемента на страницу
   let counter = 0;
   return (data = info) => {

      //This function is only used in function showMovie. We can not use it 
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
      for (let i = 0; i < data.length; i++) {
         movieContainer.appendChild(createElement(data, counter));
         counter++;
      }
   };
}

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
   lastUrl = `${searchUrl}&query=${movieName}`
   await getMovies(lastUrl);
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
      const findFlag = lastUrl.search(/&with/);
      if (findFlag >= 0) {
         lastUrl = lastUrl.substr(0,findFlag)
      } else {
         lastUrl = lastUrl + searchString;
      }
      await getMovies(lastUrl);
   }

   allGenres.forEach(element => {
      element.addEventListener('click', () => {
         element.classList.toggle('genre--active');
         searchByGenres();
      });
   });
}

showGenre(genreApi);

async function addPagination() {
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

async function updatePagination(url) {
   const request = await fetch(url);
   const data = await request.json();
   const totalPages = await data.total_pages;
   let currentPage = data.page;
   const movies = await getMovies(`${url}&page=${currentPage}`);
   currentPage++;
   nextPage.addEventListener('click', function() {
      clearMovies();
      let showMovie = showMovies(movies);
      for (let i = 0; i < movies.length; i++) {
         showMovie(movies);
      }
   })
}

const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const current = document.querySelector('#current');

prev.addEventListener('click', () => {
   if (prevPage > 0) {
      pageCall(prevPage);
   }
})

next.addEventListener('click', () => {
   if (nextPage <= totalPages) {
      pageCall(nextPage);
   }
})

function pageCall(page) {
   clearMovies();
   let urlSplit = lastUrl.split('?');
   let queryParams = urlSplit[1].split('&');
   let key = queryParams[queryParams.length - 1].split('=');
   if (key[0] != 'page') {
      let url = lastUrl + "&page=" + page;
      getMovies(url);
   } else {
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length - 1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] + '?'  + b;
      getMovies(url);
   }
}
