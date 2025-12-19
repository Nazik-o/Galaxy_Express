˚　　　　✦　　　.　　. 　 ˚　.　　　　　 . ✦　　　 　˚　　　　 . ★⋆.
　　　.   　　˚　　 　　*　　 　　✦　　　.　　.　　　✦　˚ 　　　　 ˚　.˚　　　　　　.　　. 　 ˚　.　　　　 　　 　　　　 ✦
<img width="1366" height="768" alt="Galaxy_Express_wrap-banner copy" src="https://github.com/user-attachments/assets/1cadffce-dfa2-4ee6-b261-8c53bdf6cde1" />

## ⋆⭒˚.⋆🪐 ⋆⭒˚.⋆ Shopping at the Speed of Light .𖥔 ݁ ˖ִ🛸༄˖°.
---
##  Project Overview
GalaxyExpress is a full-stack e-commerce web application that simulates a real online shopping experience. 
The project is designed to showcase real-world backend and frontend integration, including authentication, product management, shopping carts, and order checkout.

---
## 🛒 What Can Users Do?

### 🔐 Create an Account & Log In
- Users can **register** and **log in** securely.
- Authentication is handled using **JSON Web Tokens (JWT)**.
- User roles control access to protected features.
  
---
### 🧾 Browse Products & Categories
- View a list of products organized by categories.
- Filter products by category or search criteria.
- Click on a product to see more details.

---
### 🛍️ Manage a Shopping Cart
- Add products to a shopping cart.
- Increase or decrease item quantities.
- Remove items before checkout.
- View updated totals in real time.
---
### 💳 Checkout & Place Orders
- Convert the shopping cart into an order with one click.
- Orders are saved to the database with individual line items.
- Demonstrates how carts and orders work together in an e-commerce system.
---

### 👤 Manage Your Profile
- Logged-in users can view and update their profile information.
- All profile data is securely tied to the authenticated user.
---
## ⚙️ Admin Capabilities
- Only admin users can:
  - Create, update, or delete products
  - Manage product categories
- Protected using role-based authorization.
---
## 🛠️ Tech Stack

### Backend
- **Java**
- **Spring Boot**
- **MySQL**
- **JDBC DAO Pattern**
- **JWT Authentication**
- **RESTful APIs**
- ### Frontend
- **HTML**
- **CSS**
- **JavaScript**
- **Bootstrap**
- Template-based page rendering

### Tools
- **IntelliJ IDEA**
- **Maven**
- **Postman** (API testing)
---
## File Structure

This project contains **two separate apps**:

1) **Spring Boot API (backend)** — where all capstone code changes happen (controllers/DAOs/models).  
2) **Client website (frontend)** — a demo site that calls the API at `http://localhost:8080` using JavaScript.  
---

### Backend (Spring Boot API)
Location: `capstone-api-starter/`

```text
capstone-api-starter/
├─ database/
│  └─ create_database_easyshop.sql        # Creates the MySQL schema + sample data/users :contentReference[oaicite:2]{index=2}
├─ src/
│  └─ main/
│     ├─ java/
│     │  └─ org/yearup/
│     │     ├─ configurations/
│     │     │  └─ DatabaseConfig          # DB configuration
│     │     ├─ controllers/
│     │     │  ├─ AuthenticationController # /register, /login :contentReference[oaicite:3]{index=3}
│     │     │  ├─ CategoriesController     # /categories CRUD (admin-only write ops) :contentReference[oaicite:4]{index=4}
│     │     │  ├─ ProductsController       # /products + search/filter bug fixes :contentReference[oaicite:5]{index=5}
│     │     │  ├─ ShoppingCartController   # /cart endpoints (optional phase) :contentReference[oaicite:6]{index=6}
│     │     │  ├─ ProfileController        # /profile endpoints (optional phase) :contentReference[oaicite:7]{index=7}
│     │     │  └─ OrdersController         # POST /orders checkout (optional phase) :contentReference[oaicite:8]{index=8}
│     │     ├─ data/
│     │     │  ├─ mysql/
│     │     │  │  ├─ MySqlDaoBase
│     │     │  │  ├─ MySqlCategoryDao
│     │     │  │  ├─ MySqlProductDao
│     │     │  │  ├─ MySqlShoppingCartDao
│     │     │  │  ├─ MySqlProfileDao
│     │     │  │  ├─ MySqlOrdersDao
│     │     │  │  └─ MySqlUserDao
│     │     │  ├─ CategoryDao
│     │     │  ├─ ProductDao
│     │     │  ├─ ShoppingCartDao
│     │     │  ├─ ProfileDao
│     │     │  ├─ OrdersDao
│     │     │  └─ UserDao
│     │     ├─ models/
│     │     │  ├─ authentication/
│     │     │  │  ├─ LoginDto
│     │     │  │  ├─ LoginResponseDto
│     │     │  │  ├─ RegisterUserDto
│     │     │  │  └─ Authority
│     │     │  ├─ Category
│     │     │  ├─ Product
│     │     │  ├─ ShoppingCart
│     │     │  ├─ ShoppingCartItem
│     │     │  ├─ Profile
│     │     │  ├─ Order
│     │     │  └─ OrderLineItem
│     │     └─ security/
│     │        └─ (Spring Security/JWT support)
│     └─ resources/
│        ├─ application.properties         # DB settings, server config
│        └─ banner.txt                     # Console banner
├─ pom.xml                                 # Maven dependencies
└─ mvnw / mvnw.cmd                         # Maven wrapper

### Frontend
capstone-client-easyshop/
├─ index.html                              # Entry point (launch in browser)
├─ templates/                              # HTML partial templates injected by JS
│  ├─ header.html
│  ├─ home.html
│  ├─ product.html
│  ├─ cart.html
│  ├─ login-form.html
│  ├─ profile.html
│  ├─ filter.html
│  ├─ image-detail.html
│  ├─ message.html
│  └─ error.html
├─ css/
│  ├─ lib/
│  │  ├─ bootstrap.css
│  │  └─ bootstrap.min.css
│  ├─ main.css
│  ├─ header.css
│  ├─ cart.css
│  └─ wrap-banner.css
├─ images/
│  ├─ products/                            # Product images used by product cards
│  ├─ Galaxy_Express_wrap-banner.png
│  └─ logo.svg
└─ js/
   ├─ lib/                                 # 3rd party JS (if included)
   ├─ application.js                        # App bootstrapping / page routing
   ├─ config.js                             # API baseUrl (points to localhost:8080) :contentReference[oaicite:9]{index=9}
   ├─ template-builder.js                   # Loads + renders HTML templates
   ├─ filter.js                             # UI filtering logic
   └─ services/                             # API service wrappers (Axios/fetch)
      ├─ user-service.js                    # login/register + token headers
      ├─ products-service.js                # GET /products (+ query params)
      ├─ categories-service.js              # GET/CRUD /categories
      ├─ shoppingcart-service.js            # cart endpoints
      ├─ orders-service.js                  # POST /orders checkout
      └─ profile-serv
---
<img width="1621" height="923" alt="Screenshot 2025-12-19 at 8 03 10 AM" src="https://github.com/user-attachments/assets/00c77900-acee-4ee7-92a7-3dd2710af34c" />
---
### This is how it looks:
<img width="1621" height="923" alt="Screenshot 2025-12-19 at 8 03 10 AM" src="https://github.com/user-attachments/assets/ae57ec65-d235-49d5-9154-0e5de0d1cf84" />
<img width="1704" height="943" alt="Screenshot 2025-12-19 at 8 05 05 AM" src="https://github.com/user-attachments/assets/a706243d-0fb2-4e48-b6ee-91f9a32e91b9" />
<img width="1708" height="921" alt="Screenshot 2025-12-19 at 8 05 20 AM" src="https://github.com/user-attachments/assets/d4f2ec54-8cd3-4e6b-8238-6c11c090a36a" />
<img width="1702" height="899" alt="Screenshot 2025-12-19 at 8 05 30 AM" src="https://github.com/user-attachments/assets/21aa4e81-ffd6-4143-9761-bf8d9bd2e07b" />



˚　　　　✦　　　.　　. 　 ˚　.　　　　　 . ✦　　　 　˚　　　　 . ★⋆.
　　　.   　　˚　　 　　*　　 　　✦　　　.　　.　　　✦　˚ 　　　　 ˚　.˚　　　　　　.　　. 　 ˚　.　　　　 　　 　　　　 ✦
