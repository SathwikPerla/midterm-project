
const apiKey = '6c2f0813f86a4934a25cca3260bebc65'; 
const ingredientInput = document.getElementById('ingredientInput');
const ingredientList = document.getElementById('ingredientList');
const recipeList = document.getElementById('recipeList');
let ingredients = [];

document.getElementById('addIngredient').addEventListener('click', function() {
    const ingredient = ingredientInput.value.trim().toLowerCase();
    if (ingredient && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        updateIngredientList();
        fetchRecipes();
    }
    ingredientInput.value = '';
});

document.getElementById('refreshButton').addEventListener('click', function() {
    if (ingredients.length > 0) {
        fetchRecipes();
    } else {
        recipeList.innerHTML = '<p>Please add some ingredients before refreshing.</p>';
    }
});

function updateIngredientList() {
    ingredientList.innerHTML = '';
    ingredients.forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.textContent = ingredient;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.classList.add('remove-btn');
       
        removeBtn.addEventListener('click', () => {
            removeIngredient(index);
        });

        li.appendChild(removeBtn);
        ingredientList.appendChild(li);
    });
}
function removeIngredient(index) {
    ingredients.splice(index, 1);
    updateIngredientList();
    fetchRecipes(); 
}
function fetchRecipes() {
    if (ingredients.length === 0) {
        recipeList.innerHTML = '<p>Please add ingredients to search for recipes.</p>';
        return;
    }

    const ingredientQuery = ingredients.join(',');

   
    if (!ingredientQuery.trim()) {
        recipeList.innerHTML = '<p>No valid ingredients to search for.</p>';
        return;
    }

    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientQuery}&number=10&apiKey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                displayRecipes(data);
            } else {
                recipeList.innerHTML = '<p>There was an error fetching the recipes.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            recipeList.innerHTML = `<p>Failed to fetch recipes: ${error.message}. Please try again later.</p>`;
        });
}
function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    if (recipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes found with the selected ingredients.</p>';
        return;
    }
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${recipe.title}</strong><br>
            Used Ingredients: ${recipe.usedIngredientCount}<br>
            Missed Ingredients: ${recipe.missedIngredientCount}<br>
            <button class="view-recipe-btn" onclick="fetchRecipeDetails(${recipe.id})">View Recipe</button>
        `;
        recipeList.appendChild(li);
    });
}

function fetchRecipeDetails(recipeId) {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayRecipeDetails(data);
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
            recipeList.innerHTML = `<p>Failed to fetch recipe details: ${error.message}. Please try again later.</p>`;
        });
}
function displayRecipeDetails(recipe) {
    const recipeDetail = document.createElement('li');
    recipeDetail.innerHTML = `
        <strong>${recipe.title}</strong><br>
        Ready in: ${recipe.readyInMinutes} minutes<br>
        Servings: ${recipe.servings}<br>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${recipe.instructions}</p>
        <a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a>
    `;
    recipeList.innerHTML = '';
    recipeList.appendChild(recipeDetail);
}
