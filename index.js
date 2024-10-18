const baseURL = 'https://api.jsonbin.io/v3/b/67119cc6acd3cb34a898ce96';
const apiKey = '$2a$10$munKfk5utPlie.KDveDg8.hr8po9RE79des8B3bwSSefKXTA052ai';

// Get references to form elements and the list where foods will be displayed
const foodForm = document.getElementById('recipeForm');
const foodNameInput = document.getElementById('foodName');
const recipeDirectionsInput = document.getElementById('recipeDirections');
const ingredientsInput = document.getElementById('ingredients');
const imageUrlInput = document.getElementById('imageUrl');
const foodSearch = document.getElementById('foodSearch');
const foodPopup = document.getElementById('foodPopup');
const popupContent = document.getElementById('popupContent');
const closeBtn = document.querySelector('.close-btn');

// Function to fetch food items from JSONBin
function fetchFoods() {
    fetch(baseURL, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        displayFoods(data.record);
    })
    .catch(error => console.error('Error fetching food items:', error));
}

// Function to display food items in the list
function displayFoods(foods) {
    const foodList = document.getElementById('foodList');
    foodList.innerHTML = '';
    foods.forEach(food => {
        const foodItem = document.createElement('li');
        foodItem.textContent = `${food.name} - ${food.type} - $${food.price} - ${food.description}`;
        foodItem.addEventListener('click', function () {
            showFoodPopup(food);
        });
        foodList.appendChild(foodItem);
    });
}

// Function to display the popup with food details
function showFoodPopup(food) {
    popupContent.innerHTML = `
        <h2>${food.name}</h2>
        <p>Type: ${food.type}</p>
        <p>Price: $${food.price}</p>
        <p>Description: ${food.description}</p>
        ${food.imageUrl ? `<img src="${food.imageUrl}" alt="${food.name}" />` : ''}
    `;
    foodPopup.classList.add('show');
}

// Close the popup when the close button is clicked
closeBtn.addEventListener('click', function () {
    foodPopup.classList.remove('show');
});

// Handle form submission
foodForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newRecipe = {
        name: foodNameInput.value,
        directions: recipeDirectionsInput.value,
        ingredients: ingredientsInput.value.split(','),
        imageUrl: imageUrlInput.value
    };

    fetch(baseURL, {
        method: 'PATCH',
        headers: {
            'X-Master-Key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            record: [...newRecipe]
        })
    })
    .then(response => response.json())
    .then(() => {
        fetchFoods();
        foodForm.reset();  // Reset the form after submission
    })
    .catch(error => console.error('Error submitting food item:', error));
});

// Search functionality for food items
foodSearch.addEventListener('input', function () {
    const searchTerm = foodSearch.value.toLowerCase();
    const foodItems = document.getElementById('foodList').getElementsByTagName('li');

    Array.from(foodItems).forEach(item => {
        const foodText = item.textContent.toLowerCase();
        if (foodText.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Initialize food list on page load
fetchFoods();