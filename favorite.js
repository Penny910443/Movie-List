const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
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
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id
      }">X</button>
          </div>
        </div>
      
    </div>  
  `;
  });

  dataPanel.innerHTML = rawHTML;
}



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

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  movies.splice(movieIndex, 1)

  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovie(movies)
}

function getMovieByPage(page) {
  let startIndex = (page - 1) * MOVIES_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

dataPanel.addEventListener("click", function panelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset.id);
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

renderMovie(movies)
