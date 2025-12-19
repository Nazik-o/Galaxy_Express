//original code
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



/*
// --- Helper for Search Debouncing ---
// This prevents the search from firing 50 times while sliding a price bar
let searchTimeout;
function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        productService.search();
    }, 300); // Wait for 300ms of "silence" before searching
}

// --- Auth & Navigation ---
function showLoginForm() {
    templateBuilder.build('login-form', {}, 'login');
}

function hideModalForm() {
    templateBuilder.clear('login');
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Wait for server response before closing the form
        const success = await userService.login(username, password);
        if (success) {
            hideModalForm();
        } else {
            console.error("Login failed: Invalid credentials");
        }
    } catch (error) {
        console.error("Auth Error:", error);
    }
}

function loadHome() {
    templateBuilder.build('home', {}, 'main');
    productService.search();
    categoryService.getAllCategories(loadCategories);
}

// --- Profile Management ---
function editProfile() {
    profileService.loadProfile();
}

function saveProfile() {
    // Optimization: Grab all fields at once using a cleaner selector
    const profile = {
        firstName: document.getElementById("firstName").value,
        lastName:  document.getElementById("lastName").value,
        phone:     document.getElementById("phone").value,
        email:     document.getElementById("email").value,
        address:   document.getElementById("address").value,
        city:      document.getElementById("city").value,
        state:     document.getElementById("state").value,
        zip:       document.getElementById("zip").value
    };

    profileService.updateProfile(profile);
}

// --- Product & Filters ---
function showImageDetailForm(product, imageUrl) {
    const imageDetail = {
        name: product,
        imageUrl: imageUrl
    };
    // Note: ensure 'login' is the intended container for details
    templateBuilder.build('image-detail', imageDetail, 'login');
}

function setCategory(control) {
    productService.addCategoryFilter(control.value);
    debouncedSearch();
}

function setSubcategory(control) {
    productService.addSubcategoryFilter(control.value);
    debouncedSearch();
}

function setMinPrice(control) {
    const label = document.getElementById("min-price-display");
    if (label) label.innerText = control.value;

    const value = control.value != 0 ? control.value : "";
    productService.addMinPriceFilter(value);
    debouncedSearch();
}

function setMaxPrice(control) {
    const label = document.getElementById("max-price-display");
    if (label) label.innerText = control.value;

    const value = control.value != 1500 ? control.value : "";
    productService.addMaxPriceFilter(value);
    debouncedSearch();
}

// --- Cart ---
function showCart() {
    cartService.loadCartPage();
}

function clearCart() {
    cartService.clearCart();
    cartService.loadCartPage();
}

// --- Error Handling ---
function closeError(control) {
    setTimeout(() => {
        // Safety check: ensure element still exists before clicking
        if (control && document.body.contains(control)) {
            control.click();
        }
    }, 3000);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    loadHome();
});
*/
