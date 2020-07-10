//Global variables
var searchButton = document.querySelector('.button');

//function that grabs search value from the text input
var searchValue = function () {
  var userSearchValue = document.getElementById('search-term').value.trim(); //added id on html file
  console.log(userSearchValue);

//   var dropDownValues = document.getElementById('drop-down-items').options;
//   for (var i = 0; i < dropDownValues.length; i++) 

};



// //Run searchValue function when button is clicked
searchButton.addEventListener("click", searchValue);








//Example to work off of in the meantime

{/* <FORM>
Search <input type="text" id="realtxt" onkeyup="searchSel()">
<SELECT id="drop-down-items">
<OPTION value="">Select...
<OPTION value="trial-length">Trail Length
<OPTION value="difficulty">Difficulty
<OPTION value="rating">Rating
</SELECT>
</FORM> */}