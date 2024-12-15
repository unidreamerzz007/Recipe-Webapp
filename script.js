const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details .recipe-details-content'); // Corrected the selector
const recipeClosebtn = document.querySelector('.recipe-close-Btn'); // Fixed class name for close button

// Function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";

  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    if (!response.meals) {
      recipeContainer.innerHTML = "<h2>No recipes found</h2>";
      return;
    }

    recipeContainer.innerHTML = ""; // Clear loading text
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p> <span>Dish: ${meal.strArea}</span></p>
        <p>Belongs to <span>${meal.strCategory}</span> category</p>
      `;

      const button = document.createElement('button');
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);
      button.addEventListener('click', () => {
        openRecipePopup(meal);
      });
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error fetching recipes. Please try again.</h2>";
    console.error(error);
  }
};

// Function to fetch ingredients
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// Function to open the recipe popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
    <h3>Instructions:</h3>
    <p >${meal.strInstructions}</p>
    </div>
   
  `;
  document.querySelector('.recipe-details').style.display = 'block';
};

// Close the recipe popup
recipeClosebtn.addEventListener('click', () => {
  document.querySelector('.recipe-details').style.display = 'none';
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchRecipes(searchInput);
  } else {
    recipeContainer.innerHTML = "<h2>Please enter a valid search term</h2>";
  }
});