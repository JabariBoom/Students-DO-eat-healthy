const baseUrl = 'https://api.jsonbin.io/v3/b/67111d1facd3cb34a8989ec4';
const apiKey = '$2a$10$9f5zLXyC4FCiT8KwPMy83O0Jh3FnfU6Q4Pe8D.knlVqFCqqBx3ca2';

function getFoods() {
    return fetch(baseUrl, {
        method: 'GET',  // Changed to GET to fetch existing data
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey  // You might consider using X-Access-Key instead
        }
    })
    .then(response => response.json())
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
        title: foodName,
        directions: recipeDirections,
        img_URL: imgURL,
        "ingredients 1": ingredients[0],
        "ingredients 2": ingredients[1],
        "ingredients 3": ingredients[2]
    };

    fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
        },
        body: JSON.stringify(newRecipe)
    })
    .then(response => response.json())
    .then(addedRecipe => {
        addRecipeButton(addedRecipe);
        updateSearchDisplay();
        searchInput.value = '';
        refreshFoodList();  // Refresh the list of foods after adding
    })
    .catch(() => {
        alert('Error! Failed to submit recipe.');
    });

    recipeForm.reset();
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
        searchBarRow.innerHTML = '';  // Clear previous buttons
        foods.forEach(food => {
            addRecipeButton(food);
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