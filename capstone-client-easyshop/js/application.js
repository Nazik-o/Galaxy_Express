// js/application.js
// Connects UI (templates/buttons) to your services (user/cart/products/profile).

// -------------------- MODALS --------------------

function showLoginForm() {
  templateBuilder.build("login-form", {}, "login");
}

function hideModalForm() {
  templateBuilder.clear("login");
}

// IMPORTANT: userService.login() MUST return the axios promise
function login() {
  const username = document.getElementById("username")?.value ?? "";
  const password = document.getElementById("password")?.value ?? "";

  userService
    .login(username, password)
    .then(() => {
      hideModalForm(); // hide only if login succeeded
    })
    .catch(() => {
      // userService already appends error; keep modal open
    });
}

function showImageDetailForm(product, imageUrl) {
  templateBuilder.build("image-detail", { name: product, imageUrl }, "login");
}

// -------------------- PAGE LOADERS --------------------

function loadHome() {
  templateBuilder.build("home", {}, "main");

  productService.search();
  categoryService.getAllCategories(loadCategories);
}

function showCart() {
  // Always load latest cart before rendering UI
  cartService.loadCart()
    .then(() => cartService.loadCartPage())
    .catch(() => cartService.loadCartPage());
}

function editProfile() {
  profileService.loadProfile();
}

function saveProfile() {
  const profile = {
    firstName: document.getElementById("firstName")?.value ?? "",
    lastName: document.getElementById("lastName")?.value ?? "",
    phone: document.getElementById("phone")?.value ?? "",
    email: document.getElementById("email")?.value ?? "",
    address: document.getElementById("address")?.value ?? "",
    city: document.getElementById("city")?.value ?? "",
    state: document.getElementById("state")?.value ?? "",
    zip: document.getElementById("zip")?.value ?? ""
  };

  profileService.updateProfile(profile);
}

// -------------------- CART ACTIONS --------------------

function clearCart() {
  cartService.clearCart()
    .then(() => cartService.loadCartPage())
    .catch(() => cartService.loadCartPage());
}

// -------------------- CHECKOUT --------------------

function checkout() {
  console.log("Checkout clicked");

  if (!userService.isLoggedIn()) {
    templateBuilder.append("error", { error: "Please login to checkout." }, "errors");
    showLoginForm();
    return;
  }

  if (!cartService.cart.items || cartService.cart.items.length === 0) {
    templateBuilder.append("error", { error: "Your cart is empty." }, "errors");
    return;
  }

  if (!window.orderService || typeof orderService.checkout !== "function") {
    templateBuilder.append(
      "error",
      { error: "Checkout service not loaded. Make sure orders-service.js loads before application.js." },
      "errors"
    );
    return;
  }

  orderService.checkout()
    .then((res) => {
      console.log("Checkout success:", res?.data);
      templateBuilder.append("message", { message: "Order placed successfully!" }, "errors");
      return cartService.loadCart();
    })
    .then(() => cartService.loadCartPage())
    .catch((error) => {
      console.log("Checkout failed:", error);

      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        (error?.response?.status ? `Checkout failed (HTTP ${error.response.status})` : "Checkout failed.");

      templateBuilder.append("error", { error: msg }, "errors");
    });
}

// -------------------- FILTER CONTROLS --------------------

function setCategory(control) {
  productService.addCategoryFilter(control.value);
  productService.search();
}

function setSubcategory(control) {
  productService.addSubcategoryFilter(control.value);
  productService.search();
}

function setMinPrice(control) {
  const label = document.getElementById("min-price-display");
  if (label) label.innerText = control.value;

  const value = control.value != 0 ? control.value : "";
  productService.addMinPriceFilter(value);
  productService.search();
}

function setMaxPrice(control) {
  const label = document.getElementById("max-price-display");
  if (label) label.innerText = control.value;

  const value = control.value != 1500 ? control.value : "";
  productService.addMaxPriceFilter(value);
  productService.search();
}

// -------------------- ERROR HELPERS --------------------

function closeError(control) {
  setTimeout(() => {
    try { control.click(); } catch (e) {}
  }, 3000);
}

// -------------------- STARTUP --------------------

document.addEventListener("DOMContentLoaded", () => {
  loadHome();
});







//original code
/*
function showLoginForm()
{
    templateBuilder.build('login-form', {}, 'login');
}

function hideModalForm()
{
    templateBuilder.clear('login');
}

function login()
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    userService.login(username, password);
    hideModalForm()
}

function showImageDetailForm(product, imageUrl)
{
    const imageDetail = {
        name: product,
        imageUrl: imageUrl
    };

    templateBuilder.build('image-detail',imageDetail,'login')
}

function loadHome()
{
    templateBuilder.build('home',{},'main')

    productService.search();
    categoryService.getAllCategories(loadCategories);
}

function editProfile()
{
    profileService.loadProfile();
}

function saveProfile()
{
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;

    const profile = {
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        state,
        zip
    };

    profileService.updateProfile(profile);
}

function showCart()
{
    cartService.loadCartPage();
}

function clearCart()
{
    cartService.clearCart();
    cartService.loadCartPage();
}

function setCategory(control)
{
    productService.addCategoryFilter(control.value);
    productService.search();

}

function setSubcategory(control)
{
    productService.addSubcategoryFilter(control.value);
    productService.search();

}

function setMinPrice(control)
{
    // const slider = document.getElementById("min-price");
    const label = document.getElementById("min-price-display")
    label.innerText = control.value;

    const value = control.value != 0 ? control.value : "";
    productService.addMinPriceFilter(value)
    productService.search();

}

function setMaxPrice(control)
{
    // const slider = document.getElementById("min-price");
    const label = document.getElementById("max-price-display")
    label.innerText = control.value;

    const value = control.value != 1500 ? control.value : "";
    productService.addMaxPriceFilter(value)
    productService.search();

}

function closeError(control)
{
    setTimeout(() => {
        control.click();
    },3000);
}

document.addEventListener('DOMContentLoaded', () => {

    loadHome();
});

*/

