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
        console.log('API response data:', data);
        const foodItems = data.record;
        
        if (Array.isArray(foodItems)) {
            displayFoodButtons(foodItems); // Display the buttons for existing food items
        } else {
            console.error('data.record is not an array:', data.record);
        }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Display food buttons dynamically
function displayFoodButtons(foodItems) {
    const defaultButtonsDiv = document.getElementById('default-buttons');
    defaultButtonsDiv.innerHTML = ''; // Clear existing buttons

    foodItems.forEach(food => {
        const button = document.createElement('button');
        button.textContent = food.title;
        button.onclick = () => showFoodPopup(food); // Display popup on click
        defaultButtonsDiv.appendChild(button);
    });
}

// Show popup with food details
function showFoodPopup(food) {
    const popup = document.getElementById('foodPopup');
    const popupContent = document.getElementById('popupContent');
    
    let content = `<h3>${food.title}</h3>`;
    content += `<p><strong>Directions:</strong> ${food.directions}</p>`;
    content += `<p><strong>Ingredients:</strong></p><ul>`;
    
    if (food['ingredients 1']) content += `<li>${food['ingredients 1']}</li>`;
    if (food['ingredients 2']) content += `<li>${food['ingredients 2']}</li>`;
    if (food['ingredients 3']) content += `<li>${food['ingredients 3']}</li>`;
    
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
        const foodItems = data.record;

        if (Array.isArray(foodItems)) {
            const updatedFoodItems = [...foodItems, newFood]; // Add the new item to the existing data

            // Update JSONBin with the new food list
            return fetch(baseURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                },
                body: JSON.stringify(updatedFoodItems)
            });
        } else {
            console.error('data.record is not an array:', data.record);
        }
    })
    .then(response => response.json())
    .then(() => {
        fetchDefaultButtons(); // Refresh the displayed buttons
        document.getElementById('recipeForm').reset(); // Clear the form
    })
    .catch(error => console.error('Error adding new food:', error));
});