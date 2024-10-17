// baseUrl and apiKey declared directly in index.js
const baseUrl = 'https://api.jsonbin.io/v3/b/67119cc6acd3cb34a898ce96'; // New base URL
const apiKey = '$2a$10$munKfk5utPlie.KDveDg8.hr8po9RE79des8B3bwSSefKXTA052ai'; // New API key

// Function to get foods from the API
function getFoods() {
    return fetch(baseUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey // Use new key directly
        }
    })
    .then(response => response.json())
    .then(foodData => {
        console.log('foodData:', foodData);
        if (foodData && foodData.record && Array.isArray(foodData.record.Foods)) {
            return foodData.record.Foods;
        } else {
            throw new Error("No foods found in the response or foods data structure is incorrect");
        }
    })
    .catch(() => {
        alert('Error! Failed to connect to API.');
        return [];
    });
}

// Function to add food to the API
function addFood(food) {
    const foodData = {
        name: food.foodName,
        imageUrl: food.imageUrl,
        recipe: food.recipeDirections,
        ingredients: food.ingredients
    };

    return fetch(baseUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
        },
        body: JSON.stringify({
            Foods: foodData
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Added Food:', data);
    })
    .catch((error) => {
        console.error('Error adding food:', error);
    });
}

// Submission event listener
document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const foodName = document.getElementById('foodName').value;
    const recipeDirections = document.getElementById('recipeDirections').value;
    const ingredients = document.getElementById('ingredients').value;
    const imageUrl = document.getElementById('imageUrl').value || 'default-image-url.jpg';

    addFood({
        foodName,
        recipeDirections,
        ingredients,
        imageUrl
    });

    this.reset();
});

// Function to display selected food in a popup
function showFood(id) {
    getFoods().then(foods => {
        const food = foods.find(f => f.id === id);
        if (food) {
            const popupContent = `
                <h2>${food.name}</h2>
                <p>${food.recipe}</p>
                <p><strong>Ingredients:</strong> ${food.ingredients}</p>
                <img src="${food.imageUrl}" alt="${food.name}">
            `;
            const popup = document.getElementById('foodPopup');
            document.getElementById('popupContent').innerHTML = popupContent;
            popup.classList.add('show');

            document.querySelector('.close-btn').addEventListener('click', () => {
                popup.classList.remove('show');
            });
        }
    });
}