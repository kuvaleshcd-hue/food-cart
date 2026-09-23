# 🍔 Food Cart

A simple and user-friendly **Food Cart Web Application** that allows users to browse food items, add items to their cart, place orders, and manage their profiles.

The project uses **Firebase** for backend services and provides separate pages for authentication, food menu, cart management, orders, profile management, and admin functionality.

## 🚀 Features

* 🔐 User Registration and Login
* 🍕 Browse Food Menu
* 🛒 Add food items to Cart
* ➕ Increase or decrease item quantity
* 🗑️ Remove items from Cart
* 📦 Manage and view Orders
* 👤 User Profile
* 🏨 Browse Hotels/Food Providers
* 🔧 Admin Food Upload
* 🔥 Firebase integration
* 📱 Responsive web interface
* ⚡ Service Worker support

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend / Services

* Firebase
* Firebase Authentication
* Firebase Database / Storage

### Other

* Service Worker
* Git & GitHub

## 📂 Project Structure

```text
food-cart/
│
├── .vscode/
│
├── foodcart/
│
├── admin-upload.html
├── api.js
├── cart.html
├── cart.js
├── firebase.js
├── hotels.html
├── index.html
├── login.html
├── menu.html
├── orders.html
├── profile.html
├── register.html
└── sw.js
```

## 📄 Main Pages

| File                | Description                   |
| ------------------- | ----------------------------- |
| `index.html`        | Home page                     |
| `login.html`        | User login                    |
| `register.html`     | User registration             |
| `menu.html`         | Displays available food items |
| `cart.html`         | Shopping cart                 |
| `orders.html`       | User orders                   |
| `profile.html`      | User profile                  |
| `hotels.html`       | Hotels/food providers         |
| `admin-upload.html` | Admin food upload             |
| `firebase.js`       | Firebase configuration        |
| `api.js`            | API-related functionality     |
| `cart.js`           | Cart functionality            |
| `sw.js`             | Service worker                |

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kuvaleshcd-hue/food-cart.git
```

### 2. Navigate to the Project

```bash
cd food-cart
```

### 3. Configure Firebase

Create a Firebase project and configure the Firebase credentials in:

```text
firebase.js
```

Add your Firebase configuration according to your project setup.

### 4. Run the Project

You can use **VS Code Live Server** or any local web server.

For example, using VS Code:

1. Open the project in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## 🔥 Firebase Setup

The application uses Firebase services for backend functionality.

You need to configure:

* Firebase Authentication
* Firebase Database
* Firebase Storage (if required by the application)

Make sure your Firebase security rules are configured properly before deploying the application.

## 🧑‍💻 User Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Browse Food Menu
 │
 ▼
Select Food
 │
 ▼
Add to Cart
 │
 ▼
Review Cart
 │
 ▼
Place Order
 │
 ▼
View Orders
```

##
