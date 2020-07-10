

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
}
getCityCoord("tucson, arizona");
function forecastWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
}
function getHikingInfo(lat, lon) {
    fetch("https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&key=200829481-354572aba0151d42b45ec3c006e7cbef")
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data.trails)
                //displayTrails(data)
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
}

function displayTrails(trails) {
    
}