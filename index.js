const baseUrl = 'https://api.jsonbin.io/v3/b/67113b1facd3cb34a898aa80'; // Correct bin ID
const apiKey = '$2a$10$cfl2/y5By7tGiCYiwlYmVOtxiTFmN9PAGks28UKalWEL0tlcXP0i.'; // Master key

function getFoods() {
    return fetch(baseUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey // Master key for private bin
        }
    })
    .then(response => response.json())
    .then(foodData => {
        console.log('foodData:', foodData); // Log to inspect the structure
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
        <img src="${food.img_URL}" alt="${food.title}">
        <h2>${food.title}</h2>
        <p>Directions: ${food.directions}</p>
        <p>Ingredients:</p>
        <ul>${ingredientsList}</ul>
    `;
    popup.classList.add("show");
}

const closeButton = document.querySelector(".close-btn");
closeButton.onclick = function() {
    const popup = document.getElementById("foodPopup");
    popup.classList.remove("show");
};

const recipeForm = document.getElementById("recipeForm");
recipeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const foodName = document.getElementById("foodName").value;
    const recipeDirections = document.getElementById("recipeDirections").value;
    const ingredients = document.getElementById("ingredients").value.split(',');
    const imgURL = document.getElementById("imageUrl").value;

    const newRecipe = {
        id: Date.now(), // Generate a unique ID for each new recipe
        title: foodName,
        directions: recipeDirections,
        img_URL: imgURL,
        "ingredients 1": ingredients[0],
        "ingredients 2": ingredients[1],
        "ingredients 3": ingredients[2]
    };

    getFoods().then(existingFoods => {
        const updatedFoods = [...existingFoods, newRecipe];

        fetch(baseUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({ Foods: updatedFoods }) // Update the Foods array
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            addRecipeButton(newRecipe); // Add the new recipe button to the UI
            updateSearchDisplay();
            searchInput.value = '';
            refreshFoodList();
        })
        .catch(() => {
            alert('Error! Failed to submit recipe.');
        });

        recipeForm.reset(); // Reset the form after submission
    });
});

function addRecipeButton(recipe) {
    const newButton = document.createElement("button");
    newButton.innerHTML = `
        ${recipe.title} 
        <span class="delete-btn">X</span>
    `;
    newButton.onclick = function() {
        showFood(recipe.id);
    };
    newButton.classList.add("recipe-button");

    const deleteBtn = newButton.querySelector(".delete-btn");
    deleteBtn.onclick = function(event) {
        event.stopPropagation();
        searchBarRow.removeChild(newButton);
    };

    searchBarRow.appendChild(newButton);
}

function refreshFoodList() {
    getFoods().then(foods => {
        searchBarRow.innerHTML = ''; // Clear the current buttons
        foods.forEach(food => {
            addRecipeButton(food); // Add buttons for each food item
        });
    });
}

function updateSearchDisplay() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const buttons = document.querySelectorAll('.row button');

    buttons.forEach(button => {
        const buttonText = button.innerText.toLowerCase();
        if (buttonText.includes(searchTerm)) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

const searchInput = document.getElementById('foodSearch');
const searchBtn = document.getElementById('searchBtn');
const searchBarRow = document.querySelector(".row");

searchBtn.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const buttons = document.querySelectorAll('.row button');

    buttons.forEach(button => {
        const buttonText = button.innerText.toLowerCase();
        if (buttonText.includes(searchTerm)) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
});