var cardDisplayEl = document.getElementById("cards");
var searchBtnEl = document.getElementById("search-button");
var citySearchEl = document.getElementById("search-term");
var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById('myModal');


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
                console.log("trails", data.trails)
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

        // //trail difficulty data
        // var difficulty = document.getElementById("difficulty");
        // var difficultyData = document.createElement("span");
        // difficultyData.textContent = "Difficulty: " + trails[i].difficulty;
        // difficulty.appendChild(difficultyData);
  

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

}

//function that changes the textContent of each data. based on the data.attribute set
function showModal(data){
    modal.style.display = "block";
    var difficulty = document.getElementById("difficulty");
    difficulty.textContent = "Difficulty: " + data.difficulty;

    var length = document.getElementById("length");
    length.textContent = "Length: " + data.length;

    var ascent = document.getElementById("ascent");
    ascent.textContent = "Ascent: " + data.ascent;

    var descent = document.getElementById("descent");
    descent.textContent = "Descent: " + data.descent;
}


//event listeners
searchBtnEl.addEventListener("click", getCityHandler);











// //NEED TO ADJUST CODE BASED ON COMPLETION OF HTML FILE AND HIKING TRAIL RESULTS
// //DYNAMICALLY CREATE HTML/CSS FOR MODULE THROUGH JS FILE

// // Get the modal
// var modal = document.getElementById('myModal'); 

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn"); 

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }
