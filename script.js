const apikey='f4ad5e4e';
const moviename=document.getElementById('moviename');
if(moviename !==null){moviename.addEventListener("input", getMovies);}


var poster=document.getElementById('movieresult');
if(poster !==null){poster.innerHTML = "<h1>Your search result</h1>";}


// Add an event listener to the search input for input changes

async function getMovies(event) {
    const searchname=moviename.value;
      if(searchname !== ""){
 try{
    const api=`https://www.omdbapi.com/?apikey=${apikey}&s=${searchname}`
    const response = await fetch(api);
    //http://www.omdbapi.com/?t=pathan&y=2023
    const movies = await response.json();
    if(movies.Search && movies.Response === "True"){
        console.log(movies.Search)
        poster.innerHTML = "";
        for(const movie of movies.Search){
      
        const moviediv=createmoviediv(movie);
        poster.appendChild(moviediv);
        }
    }
    else{
        console.log("no result");
        poster.innerHTML = "<P>result not found<p/>";
    }
 }
 catch{
    poster.innerHTML = "<P>no found<p/>"
 }
}}


var btnfav;


//to render data on home page
function createmoviediv(movie){
  if(movie.Poster==="N/A"){
 movie.Poster="https://upload.wikimedia.org/wikipedia/commons/f/f9/No-image-available.jpg"
  }
 const moviediv=document.createElement('div');
  const a=`<div class="card bg-dark" style="width: 18rem ">
  <img src="${movie.Poster}" class=" img-thumbnail" alt="..." ">
  <div class="card-body">
    <h5 class="card-title"><a href="movie.html?id=${movie.imdbID}">${movie.Title}</a></h5>
    <p class="card-text text-white">Year: ${movie.Year}</p>
    <button type="button" class="btn btn-primary" onclick="addToFavorites('${movie.imdbID}')">fav</button>
  </div>
</div>`

moviediv.innerHTML=a;
return moviediv;    
}



//to render data on fav page
function createfavdiv(movie){
  if(movie.Poster==="N/A"){
    movie.Poster="https://upload.wikimedia.org/wikipedia/commons/f/f9/No-image-available.jpg"
     }

  const moviediv=document.createElement('div');
  const a=`<div class="card bg-dark" style="width: 18rem ">
  <img src="${movie.Poster}" class=" img-thumbnail" alt="..." ">
  <div class="card-body">
    <h5 class="card-title"><a href="movie.html?id=${movie.imdbID}">${movie.Title}</a></h5>
    <p class="card-text">Year: ${movie.Year}</p>
  
    <button type="button" class="btn btn-primary" onclick="addToFavorites('${movie.imdbID}')">remove</button>
  </div>
</div>`

moviediv.innerHTML=a;
return moviediv;
}



//function to render movie on movie page
async function moviedetails(){
    const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("id");
  console.log(movieID);
 const movie=await movieBymovieID(movieID);
  const a=` <div class="card mb-3 m-5 bg-dark text-white" style="max-width: 940px; ">
  <div class="row g-0">
    <div class="col-md-6">
      <img src="${movie.Poster}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-6">
      <div class="card-body">
        <h2 class="card-title">Movie name: ${movie.Title}</h2>
        <h5 class="card-title">Plot: ${movie.Plot}</h5>
        <h5 class="card-title">Year: ${movie.Year}</h5>
        <h5 class="card-title">Actor: ${movie.Actors}</h5>
        <a class="nav-link  text-success" href="index.html">=>Back to home</a>
      </div>
    </div>
  </div>
</div>`
  const moviediv=document.createElement('div');
  moviediv.innerHTML=a;

  

   const moviedetails=document.getElementById('movieDetails');
   if (moviedetails !==null){ moviedetails.appendChild(moviediv);};
 
}

//function to get movie by movieid
async function movieBymovieID(movieID){
  const api=`https://www.omdbapi.com/?apikey=${apikey}&i=${movieID}`
    const response = await fetch(api);
    //http://www.omdbapi.com/?t=pathan&y=2023
    const movie = await response.json();
    console.log(movie)
    return movie;
    
}





const favmovie=[1];
localStorage.setItem('fav', JSON.stringify(favmovie));

function addToFavorites(movieID) {
  // Get the favorites from localStorage or initialize an empty array
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // If the movie ID is not already in favorites, add it and update localStorage
  if (!favorites.includes(movieID)) {
    favorites.push(movieID);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie added to Watchlist");
    loadFavorites();
  } else {
    // If the movie ID is already in favorites, remove it
    removeFromFavorites(movieID);

  }
}

// Function to remove a movie from favorites
function removeFromFavorites(movieID) {
  // Get the favorites from localStorage or initialize an empty array
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.indexOf(movieID);

  // If the movie ID is found in favorites, remove it and update localStorage
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie removed from Watchlist");
    loadFavorites();
  }
}

// Function to load and display favorite movies
async function loadFavorites() {
  const favoritesContainer = document.getElementById("favoriteMovies");
  if(favoritesContainer!==null){favoritesContainer.innerHTML = "";}

  // Get the favorites from localStorage or initialize an empty array
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length > 0) {
    // Iterate over each movie ID in favorites and fetch the movie details
    for (const movieID of favorites) {
      const movie = await movieBymovieID(movieID);

      if (movie) {
        // Create a movie element for each fetched movie and append it to the favorites container
        const movieElement = createfavdiv(movie, false);
       if(favoritesContainer!==null){ favoritesContainer.appendChild(movieElement);}
      }
    }
  } else {
    // Display a message if no favorite movies are found
   if(favoritesContainer !==null){ favoritesContainer.innerHTML = "<p>No Favorite Movies Found</p>";}
  }
}


//checking on which page we are and according to that calling function
window.onload=function(){
  const location=window.location.href;
  // console.log(location)
if(location.includes("movie.html")){
  moviedetails()
}
else{
  loadFavorites();
}

}





