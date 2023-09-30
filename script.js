const NASA_API_KEY = "MfXdazpIUdmE62Zq2BE6pJ1051vrQLqbCXdbxDSQ"; // Replace with your actual NASA API key
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentImageContainer = document.getElementById(
  "current-image-container"
);


const searchHistoryList = document.getElementById("search-history");

// Function to clear local storage
function clearLocalStorage() {
    localStorage.removeItem('searches');
}

// Function to fetch the image of the day for the current date
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  await getImageOfTheDay(currentDate);
}

// Function to fetch the image of the day for the given date
async function getImageOfTheDay(date) {
  const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data)
    if (response.ok) {
      displayImage(data);
      saveSearch(date);
    } else {
      displayErrorMessage("Failed to fetch image of the day.");
    }
  } catch (error) {
    displayErrorMessage("An error occurred while fetching data.");
  }
}

// Function to display the image
function displayImage(data) {
    const heading = document.querySelectorAll("h1")[0];
    heading.innerText = `Picture On ${data.date}`;
    currentImageContainer.innerHTML = `
      <img src="${data.hdurl}" alt="${data.title}">
      <h2>${data.title}</h2>
      <p>${data.explanation}</p>
    `;
}
  

// Function to display an error message
function displayErrorMessage(message) {
  currentImageContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Function to save the search date to local storage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.push(date);
  localStorage.setItem("searches", JSON.stringify(searches));
  addSearchToHistory();
}

// Function to display search history
function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searchHistoryList.innerHTML = "";

  for (const search of searches) {
    const listItem = document.createElement("li");
    listItem.textContent = search;
    listItem.addEventListener("click", () => getImageOfTheDay(search));
    searchHistoryList.appendChild(listItem);
  }
}

// Event listener for form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedDate = searchInput.value;
  getImageOfTheDay(selectedDate);
});


// Event listener for window load
window.addEventListener('load', () => {
    clearLocalStorage(); // Clear local storage when the window loads
    getCurrentImageOfTheDay();
    addSearchToHistory();
});