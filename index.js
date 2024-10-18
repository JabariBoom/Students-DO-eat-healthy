const baseUrl = 'https://api.jsonbin.io/v3/b/67119cc6acd3cb34a898ce96';
import apiKey from './config.js';

function getFoods() {
    return fetch(baseUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
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

function showFood(foodId) {
    getFoods().then(foodData => {
        const selectedFood = foodData.find(food => food.id == foodId);
        if (selectedFood) {
            renderFoodPopup(selectedFood);
        }
    });
}
showFood();

function renderFoodPopup(food) {
    const popup = document.getElementById("foodPopup");
    const popupContent = document.getElementById("popupContent");

    let ingredientsList = '';
    for (let key in food) {
        if (key.startsWith('ingredients')) {
            ingredientsList += `<li>${food[key]}</li>`;
        }
    }

    popupContent.innerHTML = `
        <img src="${food.imageUrl}" alt="Image of ${food.title}">
        <h2>${food.title}</h2>
        <ul>${ingredientsList}</ul>
        <p>${food.directions}</p>
    `;

    popup.style.display = 'block';

    const closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });
}

// Form submission event
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const foodName = document.getElementById('foodName').value;
    const recipeDirections = document.getElementById('recipeDirections').value;
    const ingredients = document.getElementById('ingredients').value.split(',').map(ing => ing.trim());
    const imageUrl = document.getElementById('imageUrl').value;

    const newFood = {
        title: foodName,
        directions: recipeDirections,
        ingredients,
        imageUrl
    };

    try {
        let foodData = await getFoods();
        foodData.push(newFood);
        console.log('New food data:', foodData);

        const response = await fetch(baseUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({ Foods: foodData })
        });

        if (response.ok) {
            alert('Recipe added successfully!');
            document.getElementById('recipeForm').reset();
        } else {
            alert('Failed to add recipe.');
        }
    } catch (error) {
        alert('Error occurred while submitting the form.');
    }
});
