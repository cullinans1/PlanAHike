var cardDisplayEl = document.getElementById("cards");
var searchBtnEl = document.getElementById("search-button");
//var citySearchEl = document.getElementById("search-term");
var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById('myModal');
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#searchTxtInput");
var historyContainerEl = document.querySelector("#searchDatalist");
var loadMoreEl = document.getElementById("load-more");

//create history dropdown elements in hike search field
var createHistoryDropdown = function(){
    //console.log("createHistoryDropdown");
    historyContainerEl.innerHTML = "";
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr"));
    if (searchHistoryArr != null){
        searchHistoryArr = searchHistoryArr.sort();
        //console.log(searchHistoryArr);
        for (var i=0;i<searchHistoryArr.length;i++){
            //console.log(searchHistoryArr[i]);
            var historyListItem = document.createElement("option");
            historyListItem.value = searchHistoryArr[i];
            historyListItem.text = searchHistoryArr[i];
            historyContainerEl.appendChild(historyListItem);
        }
    }

}

//store search in localStorage
var storeSearchHistory = function(searchValue){
    //console.log(searchValue);
    
    //strip search value of leading/trailing spaces and lowercase
    var cleanedSearchValue = searchValue.toLowerCase().trim();
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr"));

    //console.log(searchHistoryArr);

    //if localstorage var doesn't exist
    if (searchHistoryArr === null){
        searchHistoryArr = [];
    }

    //avoids duplicates - if searched value does not already exist in localStorage array, add it
    if (searchHistoryArr.indexOf(cleanedSearchValue) < 0){
        searchHistoryArr.push(cleanedSearchValue);
        localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
    }

}

var getCityHandler = function(event) {
    event.preventDefault();
    var cityName = searchInputEl.value.trim();
    if (cityName) {
        getCityCoord(cityName);
        searchInputEl.value= "";
    } else {
        return;
    }
}

function getCityCoord(city, state) {
    
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
            getSelectedValue(data.coord.lat, data.coord.lon); //removed getHikingInfo call and replaced with getSelectedValue (getHikingInfo is called in getSelectedValue)
            forecastWeather(data.coord.lat, data.coord.lon);
            });
        } else {
            
        }
    });
}

function forecastWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
}

//function that gets lat and long ONLY
function getHikingInfo(lat, lon) {
  fetch("https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&maxResults=30&key=200829481-354572aba0151d42b45ec3c006e7cbef")
  .then(function(response) {
      if (response.ok) {
          response.json().then(function(data) {
              console.log(data.trails)
              displayTrails(data, data.trails)
          });
      } else {
          
      }
  });
}

//function that gets the sort
function getHikingSort(result,lat, lon) {
  // console.log(selectedItem);
    fetch("https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&maxResults=30&key=200829481-354572aba0151d42b45ec3c006e7cbef" + "&sort=" + result)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data.trails)
                displayTrails(data, data.trails)
            });
        } else {
            
        }
    });
}

// Function that grabs getHikingInfo and getHikingSort
function getSelectedValue (lat, lon) {
  var list = document.getElementById("myList");
  var result = list.options[list.selectedIndex].value;
  console.log(result)
  if(result !== "") {
    console.log("nul not selected")
    getHikingSort(result, lat, lon);
  }
  else{
    getHikingInfo(lat, lon) //add function that calls just lat and lon here!
  }
}



function displayTrails(data, trails) {
    //clear out previous data
    cardDisplayEl.textContent = "";
    for(var i = 0; i < 6; i++ ) {
        if(trails[i].imgMedium !== "" ) {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", trails[i].imgMedium);
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        } else {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", "assets/images/mountain.png");
            //Icons made by <a href="https://www.flaticon.com/authors/pongsakornred" title="pongsakornRed">pongsakornRed</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        };
        
        //for title of hike
        var hikeTitle = document.createElement("p");
        hikeTitle.classList = "lead";
        hikeTitle.textContent = trails[i].name;
        callout.appendChild(hikeTitle);

        var hikeLocation = document.createElement('p');
        hikeLocation.classList = "subheader";
        hikeLocation.style = "color: black;"
        hikeLocation.textContent = trails[i].location;
        callout.appendChild(hikeLocation);

        //for discription
        var hikeSummary = document.createElement('p');
        hikeSummary.classList = "subheader";
        hikeSummary.textContent = trails[i].summary;
        callout.appendChild(hikeSummary);

        //button that opens modal
        var modalButton = document.createElement("button");
        modalButton.textContent = "See trial details";
        modalButton.classList.add("modalBtn");
        modalButton.setAttribute("data-id", i);
        modalButton.id = "myBtn";
        callout.appendChild(modalButton);
  

        // when the user clicks on the button, open modal
        modalButton.onclick = function(e) {
            const thisTrail = trails[parseInt(e.target.dataset.id)]
            showModal(thisTrail);
        }

        //when the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        //When the user clicks anywhere outside of modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        //append all to page
        cardDisplayEl.appendChild(calloutContainer);
    }
    //slicing data to display on page
    var firstSliceValue = 0
    var sliceValue = 6
    
    //var firstSlice = data.trails.slice(firstSliceValue, sliceValue);
    function addSliceValue () {
        event.preventDefault();
        sliceValue += 6
        firstSliceValue += 6
        var slicedValue = firstSlice = data.trails.slice(firstSliceValue, sliceValue)
        slicedResults(slicedValue);
        console.log(slicedValue);
    }
    loadMoreEl.addEventListener("click", addSliceValue);
    function slicedResults (slicedValue) {
    for(var i = 0; i < slicedValue.length; i++ ) {
        if(slicedValue[i].imgMedium !== "" ) {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", slicedValue[i].imgMedium);
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        } else {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", "assets/images/mountain.png");
            //Icons made by <a href="https://www.flaticon.com/authors/pongsakornred" title="pongsakornRed">pongsakornRed</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        };
        
        //for title of hike
        var hikeTitle = document.createElement("p");
        hikeTitle.classList = "lead";
        hikeTitle.textContent = slicedValue[i].name;
        callout.appendChild(hikeTitle);

        var hikeLocation = document.createElement('p');
        hikeLocation.classList = "subheader";
        hikeLocation.style = "color: black;"
        hikeLocation.textContent = slicedValue[i].location;
        callout.appendChild(hikeLocation);

        var hikeSummary = document.createElement('p');
        hikeSummary.classList = "subheader";
        hikeSummary.textContent = slicedValue[i].summary;
        callout.appendChild(hikeSummary);

        //button that opens modal
        var modalButton = document.createElement("button");
        modalButton.textContent = "See trial details";
        modalButton.classList.add("modalBtn");
        modalButton.setAttribute("data-id", i);
        modalButton.id = "myBtn";
        callout.appendChild(modalButton);


        // when the user clicks on the button, open modal
        modalButton.onclick = function(e) {
            const thisTrail = slicedValue[parseInt(e.target.dataset.id)]
            showModal(thisTrail);
        }

        //when the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        //When the user clicks anywhere outside of modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        //append all to page
        cardDisplayEl.appendChild(calloutContainer);
    }
    }
}

//function that changes the textContent of each data. based on the data.attribute set
function showModal(data){
    modal.style.display = "block";
    var difficulty = document.getElementById("difficulty");
    difficulty.textContent = "Difficulty: " + data.difficulty;

    var length = document.getElementById("length");
    length.textContent = "Length: " + data.length + " mi";

    var ascent = document.getElementById("ascent");
    ascent.textContent = "Ascent: " + data.ascent + " ft";

    var descent = document.getElementById("descent");
    descent.textContent = "Descent: " + data.descent + " ft"; 
}


var formSubmitHandler = function(event){
    event.preventDefault();

    //console.log(event);

    // get value from input element
    var searchValue = searchInputEl.value.trim();
    
    //console.log(cityname);

    if (searchValue) {
        storeSearchHistory(searchValue);
        getCityCoord(searchValue);
        searchInputEl.value = "";
    } else {
        //TODO : VALIDATION MODAL TO GO HERE TO STATE THAT USER NEEDS TO ENTER A VALID DESTINATION (NOT BLANK)
    }
}


//event listeners
searchBtnEl.addEventListener("click", getCityHandler);
searchFormEl.addEventListener("submit", formSubmitHandler);
searchInputEl.addEventListener("focus", createHistoryDropdown);









