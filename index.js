const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector('#paginator')
const movies = [];
function renderMovie(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
  <div class="col-sm-3 mb-2">
     
        <div class="card">
          <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
      }">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id
      }">+</button>
          </div>
        </div>
      
    </div>  
  `;
  });

  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for(let page = 1; page <= numberOfPage; page++) {
    rawHTML +=`
    <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results);
  renderPaginator(movies.length)
  renderMovie(getMovieByPage(1));
});

function showMovieModal(id) {
  const movieModalTitle = document.querySelector("#movie-modal-title");
  const movieModalImage = document.querySelector("#movie-modal-image");
  const movieModelDate = document.querySelector("#movie-model-date");
  const movieModelDescription = document.querySelector(
    "#movie-model-description"
  );
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    movieModalTitle.innerText = data.title;
    movieModelDate.innerText = "Release Date:" + data.release_date;
    movieModelDescription.innerText = data.description;
    movieModalImage.innerHTML = `
    <img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">
    `;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  // console.log(movie);
  if (list.some((movie) => movie.id === id)) {
    return alert("The movie has been in the list!");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
  console.log(list)
}

function getMovieByPage(page) {
  let startIndex = (page - 1) * MOVIES_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

dataPanel.addEventListener("click", function panelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset.id);
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("click", function searchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  let filterMovies = [];
  // if (!keyword.length) {
  //   return alert("Please enter a valid string.");
  // }
  // for(const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filterMovies.push(movie)
  //   }
  // }
  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  if (filterMovies.length === 0) {
    return alert(`${keyword} cannot find any movies`);
  }
  renderMovie(filterMovies);
});

paginator.addEventListener('click', function onPaginatorClicked(event){
  const page = Number(event.target.dataset.page)
  if (event.target.tagName !== 'A') return
  renderMovie(getMovieByPage(page))
})