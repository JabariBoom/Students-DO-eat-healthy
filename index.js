const baseURL = 'https://api.jsonbin.io/v3/b/67119cc6acd3cb34a898ce96';
const apiKey = '$2a$10$munKfk5utPlie.KDveDg8.hr8po9RE79des8B3bwSSefKXTA052ai';

document.addEventListener("DOMContentLoaded", () => {
    fetchDefaultButtons();
});

// Fetch default buttons from JSON and display them
function fetchDefaultButtons() {
    fetch(baseURL, {
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const foodItems = data.record;
        displayFoodButtons(foodItems);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Display food buttons dynamically
function displayFoodButtons(foodItems) {
    const defaultButtonsDiv = document.getElementById('default-buttons');
    if (!defaultButtonsDiv) {
        console.error('Error: default-buttons element not found');
        return;
    }
    
    defaultButtonsDiv.innerHTML = ''; // Clear existing buttons

    foodItems.forEach(food => {
        const button = document.createElement('button');
        button.textContent = food.title;
        button.onclick = () => showFoodPopup(food);
        defaultButtonsDiv.appendChild(button);
    });
}

// Show popup with food details
function showFoodPopup(food) {
    const popup = document.getElementById('foodPopup');
    const popupContent = document.getElementById('popupContent');
    
    if (!popup || !popupContent) {
        console.error('Error: Popup or popupContent element not found');
        return;
    }
    
    let content = `<h3>${food.title}</h3>`;
    content += `<p><strong>Directions:</strong> ${food.directions}</p>`;
    content += `<p><strong>Ingredients:</strong></p><ul>`;
    
    Object.keys(food).forEach(key => {
        if (key.startsWith('ingredients')) {
            content += `<li>${food[key]}</li>`;
        }
    });

    content += `</ul><img src="${food.img_URL}" alt="${food.title} image">`;

    popupContent.innerHTML = content;
    popup.style.display = 'block';

    // Close the popup when clicking the close button
    document.querySelector('.close-btn').onclick = () => {
        popup.style.display = 'none';
    };
}

// Form submission handler to add a new food item
document.getElementById('recipeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const newFood = {
        title: document.getElementById('foodName').value,
        directions: document.getElementById('recipeDirections').value,
        'ingredients 1': document.getElementById('ingredients').value.split(',')[0],
        'ingredients 2': document.getElementById('ingredients').value.split(',')[1],
        'ingredients 3': document.getElementById('ingredients').value.split(',')[2],
        img_URL: document.getElementById('imageUrl').value
    };

    fetch(baseURL, {
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const updatedFoodItems = [...data.record, newFood]; // Add new item to the existing data
        
        // Update JSONBin with the new food list
        return fetch(baseURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(updatedFoodItems)
        });
    })
    .then(response => response.json())
    .then(() => {
        // Update the displayed buttons with the new food item
        fetchDefaultButtons();
        document.getElementById('recipeForm').reset();
    })
    .catch(error => console.error('Error adding new food:', error));
});