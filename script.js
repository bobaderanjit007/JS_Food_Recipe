const searchBtn = document.getElementById("search-btn");
const mealListEl = document.getElementById("meal");
const mealDetailsContentEl = document.querySelector(".meal-details-content")
const recipeCloseBtn = document.getElementById("recipe-close-btn");


// event listner
searchBtn.addEventListener("click", getMealList);
mealListEl.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", ()=>{
    mealDetailsContentEl.parentElement.classList.remove('showRecipe');
});

//get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxtEl = document.getElementById("search-input").value.trim()
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxtEl}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class="meal-item" data-id = "${meal.idMeal}">
                    <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="Food Image">
                    </div>
                    <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                    </div>
                    `;
                });
                mealListEl.classList.remove("notFound");
            }
            else {
                html = "Sorry, we didn't find any meal!";
                mealListEl.classList.add("notFound");
            }

            mealListEl.innerHTML = html;

        });
}

// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    console.log(e.target);
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
            
    }
}

// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let vidCode = meal.strYoutube.trim().slice(-11);
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <iframe src="https://www.youtube.com/embed/${vidCode}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    
    <div class="recipe-instruct">
        <h3 class="Instruction"></h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-link">
        <a href="#" id="show-ingredient" target="_blank">Show Ingredients <i class="fa-solid fa-arrow-down"></i></a>
    </div>
    `;
    mealDetailsContentEl.innerHTML = html;
    mealDetailsContentEl.parentElement.classList.add('showRecipe');
}

{/* 
<div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
</div>
<div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
</div> */}