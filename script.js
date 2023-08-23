const searchBtn = document.getElementById("search-btn");
const mealListEl = document.getElementById("meal");
const mealDetailsContentEl = document.querySelector(".meal-details-content")
const recipeCloseBtn = document.getElementById("recipe-close-btn");


// event listner
searchBtn.addEventListener("click", getMealList);
mealListEl.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
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
    // console.log(meal);
    meal = meal[0];

    let vidCode = meal.strYoutube.trim().slice(-11);
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <iframe src="https://www.youtube.com/embed/${vidCode}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <div class="recipe-link">
        <a href="#show-ingredients" id="show-ingredient">Show Ingredients <i id="arrow" class="fa-solid fa-chevron-down arrow-up"></i></a>
    </div>
    <div class="ingredients">
        <ul id="items-list" class="ingredients-list list-close">
        </ul>
    </div>
    <div class="recipe-instruct">
        <h3 class="Instruction"></h3>
        <p>${meal.strInstructions}</p>
    </div>
    <i>Grateful for Visiting!</i>
    `;
    mealDetailsContentEl.innerHTML = html;
    mealDetailsContentEl.parentElement.classList.add('showRecipe');

    const Ingredients = [];
    for (let i = 1; i <= 20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient !== null && ingredient.trim() !== "") {
            Ingredients.push(ingredient);
        }
    }

    const listEl = document.querySelector(".ingredients-list");
    const showListEl = document.getElementById("show-ingredient");
    const ItemListEl = document.getElementById("items-list");
    const arrowEl = document.getElementById("arrow");
    let listHtml = "";
    for(let i = 0; i < Ingredients.length; i++){
        listHtml += `
            <li>${Ingredients[i]}</li>
        `;
    }
    listEl.innerHTML = listHtml;

    showListEl.addEventListener("click", ()=>{
        let checkClass = ItemListEl.className;
        if(checkClass === "ingredients-list list-close")
        {
            ItemListEl.classList.toggle("list-open");
            ItemListEl.classList.toggle("list-close");
            arrowEl.classList.toggle("arrow-up")
            arrowEl.classList.toggle("arrow-down")
        }
        else{
            ItemListEl.classList.toggle("list-open");
            ItemListEl.classList.toggle("list-close");
            arrowEl.classList.toggle("arrow-up");
            arrowEl.classList.toggle("arrow-down");
        }
        console.log(checkClass);
    });

}

{/* 
<div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
</div>
<div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
</div> */}