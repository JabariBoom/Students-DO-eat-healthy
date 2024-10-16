const baseUrl = 'http://localhost:3000/Foods';

function getFoods() {
    return fetch(baseUrl)
        .then(response => response.json());
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
}