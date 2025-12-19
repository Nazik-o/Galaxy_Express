// js/services/shoppingcart-service.js

let cartService;

class ShoppingCartService {
  cart = {
    items: [],
    total: 0
  };

  // ✅ Add item(s) with quantity support
  // Uses existing backend endpoint: POST /cart/products/{productId}
  // If qty > 1, it sends multiple POST requests (increments quantity on backend).
  addToCart(productId, qty = 1) {
    const url = `${config.baseUrl}/cart/products/${productId}`;
    const headers = userService.getHeaders();

    qty = parseInt(qty, 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    const requests = [];
    for (let i = 0; i < qty; i++) {
      requests.push(axios.post(url, {}, { headers }));
    }

    // Return promise so callers can chain .then()
    return Promise.all(requests)
      .then(() => this.loadCart())
      .then(() => this.updateCartDisplay())
      .catch(() => {
        templateBuilder.append("error", { error: "Add to cart failed." }, "errors");
        throw new Error("Add to cart failed");
      });
  }

  setCart(data) {
    this.cart = {
      items: [],
      total: 0
    };

    // total from backend
    this.cart.total = data.total ?? 0;

    // backend returns items as object map -> convert to array
    if (data.items) {
      for (const value of Object.values(data.items)) {
        this.cart.items.push(value);
      }
    }
  }


  loadCart() {
    const url = `${config.baseUrl}/cart`;
    const headers = userService.getHeaders();

    return axios.get(url, { headers })
      .then(response => {
        this.setCart(response.data);
        this.updateCartDisplay();
        return this.cart;
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Load cart failed." }, "errors");
        throw new Error("Load cart failed");
      });
  }


  loadCartPage() {
    templateBuilder.build("cart", {}, "main", () => {
      const parent = document.getElementById("cart-item-list");
      if (!parent) return;

      parent.innerHTML = "";

      this.cart.items.forEach(item => {
        this.buildItem(item, parent);
      });


      const totalEl = document.getElementById("cart-total");
      if (totalEl) totalEl.innerText = Number(this.cart.total ?? 0).toFixed(2);
    });
  }

  buildItem(item, parent) {
    const product = item.product;

    let outerDiv = document.createElement("div");
    outerDiv.classList.add("cart-item");

    // Title
    let titleDiv = document.createElement("div");
    let h4 = document.createElement("h4");
    h4.innerText = product.name;
    titleDiv.appendChild(h4);
    outerDiv.appendChild(titleDiv);

    // Photo + price
    let photoDiv = document.createElement("div");
    photoDiv.classList.add("photo");

    let img = document.createElement("img");
    img.src = `images/products/${product.imageUrl}`;
    img.addEventListener("click", () => {
      showImageDetailForm(product.name, img.src);
    });
    photoDiv.appendChild(img);

    let priceH4 = document.createElement("h4");
    priceH4.classList.add("price");
    priceH4.innerText = `$${product.price}`;
    photoDiv.appendChild(priceH4);

    outerDiv.appendChild(photoDiv);

    // Description
    let descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = product.description;
    outerDiv.appendChild(descriptionDiv);

    // Quantity display (backend-controlled)
    let quantityDiv = document.createElement("div");
    quantityDiv.innerText = `Quantity: ${item.quantity}`;
    outerDiv.appendChild(quantityDiv);

    parent.appendChild(outerDiv);
  }


  clearCart() {
    const url = `${config.baseUrl}/cart`;
    const headers = userService.getHeaders();

    return axios.delete(url, { headers })
      .then(response => {
        this.setCart(response.data);
        this.updateCartDisplay();
        return this.cart;
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Empty cart failed." }, "errors");
        throw new Error("Empty cart failed");
      });
  }

  updateCartDisplay() {
    try {
      const itemCount = this.cart.items.length;
      const cartControl = document.getElementById("cart-items");
      if (cartControl) cartControl.innerText = itemCount;
    } catch (e) {

    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cartService = new ShoppingCartService();

  if (userService.isLoggedIn()) {
    cartService.loadCart();
  }
});
