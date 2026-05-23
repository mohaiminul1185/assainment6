const categoryContainer = document.getElementById("category-container");

const cardContainer = document.getElementById("card-container");

const cartItems = document.getElementById("cart-items");

const totalPrice = document.getElementById("total-price");

const modal = document.getElementById("modal");

const modalDetails = document.getElementById("modal-details");

const spinner = document.getElementById("spinner");

let total = 0;




function showSpinner(){
  spinner.classList.remove("hidden");
}

function hideSpinner(){
  spinner.classList.add("hidden");
}



async function loadCategories(){

  showSpinner();

  const response = await fetch(
    "https://openapi.programming-hero.com/api/categories"
  );

  const data = await response.json();

  displayCategories(data.categories);

  hideSpinner();
}


function displayCategories(categories){

  categories.forEach(category => {

    const button = document.createElement("button");

    button.innerText = category.category_name;

    button.addEventListener("click", () => {

      document
      .querySelectorAll(".categories button")
      .forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");

      loadPlantsByCategory(category.id);
    });

    categoryContainer.appendChild(button);
  });
}


async function loadAllPlants(){

  showSpinner();

  const response = await fetch(
    "https://openapi.programming-hero.com/api/plants"
  );

  const data = await response.json();

  const plants = data.plants.slice(0,6);

  displayPlants(plants);

  hideSpinner();
}




async function loadPlantsByCategory(id){

  showSpinner();

  const response = await fetch(
    `https://openapi.programming-hero.com/api/category/${id}`
  );

  const data = await response.json();

  const plants = data.plants.slice(0,6);

  displayPlants(plants);

  hideSpinner();
}




function displayPlants(plants){

  cardContainer.innerHTML = "";

  plants.forEach(plant => {

    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <img src="${plant.image}" alt="">

      <h3 onclick="loadPlantDetails(${plant.id})">
        ${plant.name}
      </h3>

      <p>${plant.description.slice(0,50)}...</p>

      <p><strong>${plant.category}</strong></p>

      <p>${plant.price} ৳</p>

      <button onclick="addToCart('${plant.name}', ${plant.price})">
        Add to Cart
      </button>
    `;

    cardContainer.appendChild(card);
  });
}


async function loadPlantDetails(id){

  showSpinner();

  const response = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`
  );

  const data = await response.json();

  const plant = data.plant;

  modal.style.display = "block";

  modalDetails.innerHTML = `
    <img src="${plant.image}"
    style="
      width:100%;
      border-radius:10px;
      margin-bottom:15px;
    ">

    <h2>${plant.name}</h2>

    <p style="
      margin:15px 0;
      line-height:1.7;
      font-size:14px;
    ">
      ${plant.description}
    </p>

    <p><strong>Category :</strong> ${plant.category}</p>

    <p><strong>Price :</strong> ${plant.price} ৳</p>
  `;

  hideSpinner();
}


document
.getElementById("close-modal")
.addEventListener("click", () => {

  modal.style.display = "none";
});


window.onclick = function(event){

  if(event.target === modal){

    modal.style.display = "none";
  }
}




function addToCart(name, price){

  total += price;

  totalPrice.innerText = total;

  const div = document.createElement("div");

  div.classList.add("cart-item");

  div.innerHTML = `
    <span>${name}</span>

    <span>
      ${price}
      <i class="fa-solid fa-xmark remove-btn"></i>
    </span>
  `;

  const removeBtn = div.querySelector(".remove-btn");

  removeBtn.addEventListener("click", () => {

    total -= price;

    totalPrice.innerText = total;

    div.remove();
  });

  cartItems.appendChild(div);
}



loadCategories();

loadAllPlants();
