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
          const windSpeed = data.wind.speed;
          console.log("Searched City:", city);
          console.log(data);
          const description = data.weather[0].description;
          const temperatureKelvin = data.main.temp;
          const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
          const temperatureFahrenheit = parseInt(
            (temperatureCelsius * 9) / 5 + 32
          ).toFixed(2);
          const location = data.name;

          // Display the search result in the specified location
          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "1" // Display the result in row-1
          );

          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "2" // Display the result in row-2
          );

          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "3" // Display the result in row-2
          );

          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "4" // Display the result in row-2
          );

          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "5" // Display the result in row-2
          );

          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "6" // Display the result in row-2
          );

          displaySearchResult(
            description,
            temperatureFahrenheit,
            location,
            windSpeed,
            "7" // Display the result in row-2
          );

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

  function displaySearchResult(
    description,
    temperature,
    location,
    windSpeed,
    rowNumber
  ) {
    const descriptionElement = $(`#r${rowNumber}-description`);
    const tempElement = $(`#r${rowNumber}-temp`);
    const locationElement = $(`#r${rowNumber}-location`);
    const windElement = $(`#r${rowNumber}-wind`);

    // Update the DOM elements with the search result
    descriptionElement.text(description);
    tempElement.html(`${temperature}&deg;F`);
    locationElement.text(location);
    windElement.html(`Wind Speed: ${(windSpeed * 2.237).toFixed(2)} mph`);
  }

  // Delete button click event listener (event delegation)
  $(document).on("click", ".delete-button", function () {
    const listItem = $(this).closest(".list-item-wrapper");
    const city = listItem.find(".list-item").text();
    const index = searchHistory.indexOf(city);

    if (index !== -1) {
      searchHistory.splice(index, 1); // Remove the city from the search history array
      listItem.remove(); // Remove the list item from the sidebar
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); // Update the search history in local storage
    }
  });
});
