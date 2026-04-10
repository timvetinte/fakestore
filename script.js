document.addEventListener("DOMContentLoaded", function () {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      updateCartCount();
    });
});

let cart = new Map(JSON.parse(localStorage.getItem("cart")) || []);
let cartCounter = JSON.parse(localStorage.getItem("cartCounter")) || 0;

// fetch("https://dummyjson.com/products")
fetch("https://dummyjson.com/products")
  .then((response) => response.json())
  .then((data) => {
    allProducts = data.products;
    displayProducts();
    createCartBoxes();
  });

function displayProducts() {
  const productsEl = document.getElementById("products");
  if (!productsEl) return;
  allProducts.forEach((product) => {
    productsEl.appendChild(createProdcutBoxes(product));
  });
}

function createProdcutBoxes(product) {
  const productEl = document.createElement("div");
  productEl.classList.add("product", "border", "border-3", "p-4", "m-3");

  productEl.innerHTML = `
      <img class="product-img mx-auto d-block" src="${product.images[0]}" alt="" />
      <div class="pt-4 text-start d-flex flex-column flex-grow-1">
      <h5 class="title">${product.title}</h5>
      <p class="price">$${product.price}</p>
      <p class="category">${product.category[0].toUpperCase() + product.category.slice(1)}</p>
      <p class="description">${product.description}</p>
      <button type="button" class="buy btn btn-secondary mt-auto">Order</button>
      </div>`;

  productEl.querySelector(".buy").addEventListener("click", function () {
    addToCart(product);
    updateCartCount();
  });

  return productEl;
}
function calculateTotal() {
  const totalEl = document.getElementById("total");
  if (!totalEl) {
    return;
  }
  let total = 0;

  for (let [id, quantity] of cart) {
    const product = allProducts.find((p) => p.id === id);
    if (product) total += product.price * quantity;
  }
  document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`;
}

function createCartBoxes() {
  const cartEl = document.getElementById("cart");

  for (let [id, quantity] of cart) {
    const product = allProducts.find((p) => p.id === id);

    const productEl = document.createElement("div");
    productEl.classList.add("cart-product", "border", "border-3", "p-4", "m-3");

    productEl.innerHTML = `
          <img class="product-img mx-auto d-block" src="${product.images[0]}" alt="" />
          <div class="pt-4 text-start d-flex flex-column flex-grow-1">
            <h5 class="title">${product.title}</h5>
            <p class="price">$${product.price}</p>
            <p class="quantity">Antal: ${quantity}</p>
            <p class="Sum">Sum: $${(product.price * quantity).toFixed(2)}</p>
            <p class="category">${product.category}</p>


            <div class="btn-group">
            <button class="btn btn-secondary remove">Remove All</button>
  <button class="btn btn-secondary minus">−1</button>
  <button class="btn btn-secondary plus">+1</button>
  
</div>

        `;
    const quantityEl = productEl.querySelector(".quantity");
    const SumEl = productEl.querySelector(".Sum");

    cartEl.appendChild(productEl);
    productEl.querySelector(".plus").addEventListener("click", function () {
      quantityEl.textContent = `Antal: ${cart.get(id)}`;
      SumEl.textContent = `Sum: $${(cart.get(id) * product.price).toFixed(2)}`;
      addToCart(product);
    });

    productEl.querySelector(".minus").addEventListener("click", function () {
      if (cart.get(id) > 1) {
        cart.set(id, cart.get(id) - 1);
        quantityEl.textContent = `Antal: ${cart.get(id)}`;
        SumEl.textContent = `Sum: $${(product.price * cart.get(id)).toFixed(2)}`;
      } else {
        cart.delete(id);
        productEl.remove();
      }

      updateCartCount();
      if (cart.size === 0) {
        document.getElementById("total").textContent = "Total: $0.00";
      }
    });

    productEl.querySelector(".remove").addEventListener("click", function () {
      cart.delete(id);
      productEl.remove();
      updateCartCount();
    });
  }

  calculateTotal();
}

function clearCart() {
  const cartEl = document.getElementById("cart");
  cart.clear();
  localStorage.removeItem("cart");
  localStorage.removeItem("cartCounter");
  updateCartCount();
  cartEl.innerHTML = "";
}

document.querySelector(".clear")?.addEventListener("click", function () {
  clearCart();
});

document.querySelector(".Order")?.addEventListener("click", function () {
  alert("Order placed.");
  clearCart();
});

function updateCartCount() {
  cartCounter = 0;

  for (let quantity of cart.values()) {
    cartCounter += quantity;
  }

  document.getElementById("cart-count").textContent = cartCounter;
  calculateTotal();

  saveToLocalStorage();
}

function addToCart(product) {
  const id = product.id;

  if (cart.has(id)) {
    cart.set(id, cart.get(id) + 1);
  } else {
    cart.set(id, 1);
  }

  updateCartCount();
}

function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(Array.from(cart.entries())));
  localStorage.setItem("cartCounter", cartCounter);
}

function validateForm() {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");
  const addressEl = document.getElementById("address");
  const zipcodeEl = document.getElementById("zipcode");
  const cityEl = document.getElementById("city");

  const nameL = document.getElementById("name-l");
  const emailL = document.getElementById("email-l");
  const phoneL = document.getElementById("phone-l");
  const addressL = document.getElementById("address-l");
  const zipcodeL = document.getElementById("zipcode-l");
  const cityL = document.getElementById("city-l");

  const nameRegEx = /^[A-Za-z\s]{2,50}$/;
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegEx = /^[\d()-]{5,20}$/;
  const addressRegEx = /^[A-Za-z0-9\s\-.,#]{2,50}$/;
  const zipcodeRegEx = /^[\d]{5}$/;
  const cityRegEx = /^[A-Za-z\s\-]{2,20}$/;

  let isValid = true;

  function validateElement(element, label, regex) {
    if (!regex.test(element.value)) {
      isValid = false;
      label.style.visibility = "visible";
    } else {
      label.style.visibility = "hidden";
    }
  }

  validateElement(nameEl, nameL, nameRegEx);
  validateElement(emailEl, emailL, emailRegEx);
  validateElement(phoneEl, phoneL, phoneRegEx);
  validateElement(addressEl, addressL, addressRegEx);
  validateElement(zipcodeEl, zipcodeL, zipcodeRegEx);
  validateElement(cityEl, cityL, cityRegEx);

  if (emailEl.value.length > 50) {
    isValid = false;
    emailL.style.visibility = "visible";
  }

  if (isValid) {
    alert("Order placed.");
    nameEl.value = "";
    emailEl.value = "";
    phoneEl.value = "";
    addressEl.value = "";
    zipcodeEl.value = "";
    cityEl.value = "";
  }
}
