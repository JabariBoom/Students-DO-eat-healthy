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

window.showFood = function(foodId) {
    getFoods().then(foodData => {
        const selectedFood = foodData.find(food => food.id == foodId);
        if (selectedFood) {
            renderFoodPopup(selectedFood);
        } else {
            alert("Food not found!");
        }
    });
};

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

window.deleteFood = function(foodId) {
    getFoods().then(foodData => {
        const foodIndex = foodData.findIndex(food => food.id == foodId);
        if (foodIndex !== -1) {
            foodData.splice(foodIndex, 1);
            fetch(baseUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                },
                body: JSON.stringify({ Foods: foodData })
            })
            .then(response => {
                if (response.ok) {
                    alert('Recipe deleted successfully!');
                    const buttonToRemove = document.querySelector(`button[data-id='${foodId}']`);
                    if (buttonToRemove) {
                        buttonToRemove.remove();
                    }
                } else {
                    alert('Failed to delete the recipe.');
                }
            })
            .catch(() => {
                alert('Error occurred while deleting the recipe.');
            });
        } else {
            alert('Recipe not found.');
        }
    });
};

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const foodName = document.getElementById('foodName').value;
    const recipeDirections = document.getElementById('recipeDirections').value;
    const ingredients = document.getElementById('ingredients').value.split(',').map(ing => ing.trim());
    const imageUrl = document.getElementById('imageUrl').value;
    const newFood = {
        id: new Date().getTime().toString(),
        title: foodName,
        directions: recipeDirections,
        ingredients,
        imageUrl
    };
    try {
        let foodData = await getFoods();
        foodData.push(newFood);
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
            const buttonRow = document.querySelector('.search-bar .row');
            const newButton = document.createElement('button');
            newButton.innerHTML = `${foodName}`;
            newButton.setAttribute('data-id', newFood.id);
            newButton.setAttribute('onclick', `showFood(${newFood.id})`);
            newButton.classList.add('food-button'); 
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'X';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.setAttribute('onclick', `deleteFood(${newFood.id})`);

            newButton.appendChild(deleteBtn);

            buttonRow.appendChild(newButton);
        } else {
            alert('Failed to add recipe.');
        }
    } catch (error) {
        alert('Error occurred while submitting the form.');
    }
});

document.getElementById('searchBtn').addEventListener('click', function() {
    const searchQuery = document.getElementById('foodSearch').value.toLowerCase();
    const buttons = document.querySelectorAll('.row button');

    buttons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        if (!buttonText.includes(searchQuery)) {
            button.style.display = 'none';
        } else {
            button.style.display = 'inline-block';
        }
    });
});
