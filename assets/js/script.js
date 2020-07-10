var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#searchTxtInput");
var historyContainerEl = document.querySelector("#searchDatalist");

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
    var cityName = citySearchEl.value.trim();
    if (cityName) {
        getCityCoord(cityName);
        citySearchEl.value= "";
    } else {
        return;
    }
}
function getCityCoord(city, state) {
    
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
            getHikingInfo(data.coord.lat, data.coord.lon);
            forecastWeather(data.coord.lat, data.coord.lon);
            });
        } else {
            
        }
    });
};
function forecastWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
}
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
function displayTrails(data, trails) {
    //clear out previous data
    cardDisplayEl.textContent = "";
    for(var i = 0; i < trails.length; i++ ) {
        //for image
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
        hikeLocation.textContent = trails[i].location;
        callout.appendChild(hikeLocation);

        //append all to page
        cardDisplayEl.appendChild(calloutContainer);
    }
    
}

var formSubmitHandler = function(event){
    event.preventDefault();

    //console.log(event);

    // get value from input element
    var searchValue = searchInputEl.value.trim();
    
    //console.log(cityname);

    if (searchValue) {
        storeSearchHistory(searchValue);
        searchInputEl.value = "";
    } else {
        //TODO : VALIDATION MODAL TO GO HERE TO STATE THAT USER NEEDS TO ENTER A VALID DESTINATION (NOT BLANK)
    }
}

searchFormEl.addEventListener("submit", formSubmitHandler);
searchInputEl.addEventListener("focus", createHistoryDropdown);
