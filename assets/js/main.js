// if (typeof $ === "undefined") {
//   console.log("jQuery is not loaded");
// } else {
//   console.log("jQuery is loaded successfully");
// }


$(document).ready(function () {
  const apiKey = "f20ebd17bb8cd071dd61063100746815";

  // Retrieve search history from local storage
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Function to update the search history in the sidebar
  function updateSearchHistory(city) {
    // Add the searched city to the search history array
    searchHistory.push(city);

    // Limit the search history to the last 5 cities
    if (searchHistory.length > 5) {
      searchHistory.shift(); // Remove the oldest city from the search history
    }

    // Update the search history in the sidebar
    const sidebarList = $("#search-history");
    sidebarList.empty(); // Clear the existing list

    // Add each city to the search history list
    searchHistory.forEach((city) => {
      const listItem = $("<li>").addClass("list-item").text(city);
      const deleteButton = $("<button>")
        .addClass("delete-button")
        .text("Delete");
      const listItemWrapper = $("<div>")
        .addClass("list-item-wrapper")
        .append(listItem, deleteButton);
      sidebarList.append(listItemWrapper);
    });

    // Save the updated search history to local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  // Search form submit event listener
  $("#form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    const cityInput = $("#city");
    const cityName = cityInput.val();

    if (cityName) {
      // Make API request for the searched city
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          const city = data.name;
          console.log("Searched City:", city);

          const description = data.weather[0].description;
          const temperatureKelvin = data.main.temp;
          const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
          const location = data.name;

          // Display the search result in the specified location
          displaySearchResult(description, temperatureCelsius, location);

          // Update the search history in the sidebar
          updateSearchHistory(city);

          // Clear the city input field
          cityInput.val("");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });

  // Function to display the search result in the specified location
  function displaySearchResult(description, temperature, location) {
    const descriptionElement = $("#r1-description");
    const tempElement = $("#r1-temp");
    const locationElement = $("#r1-location");

    // Update the DOM elements with the search result
    descriptionElement.text(description);
    tempElement.html(`${temperature}&deg;C`);
    locationElement.text(location);
  }

  // Delete button click event listener (event delegation)
  $(document).on("click", ".delete-button", function () {
    const listItem = $(this).closest(".list-item-wrapper");
    const city = listItem.find(".list-item").text();
    const index = searchHistory.indexOf(city);

    if (index !== -1) {
      searchHistory.splice(index, 1); // Remove the city from the search history array
      listItem.remove(); // Remove the list item from the sidebar

      // Save the updated search history to local storage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
  });
});
