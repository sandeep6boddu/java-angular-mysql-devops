# MillEats

**MillEats** is a full-stack e-commerce Single Page Application (SPA) designed for a healthy millet snacks brand. It features a modern, responsive storefront with a product catalog, category filtering, a sliding shopping cart, and a complete checkout flow. It also includes an integrated Admin Dashboard for managing customer orders.

This project was specifically built with a standard 3-tier architecture as a sandbox for practicing DevOps processes and CI/CD pipelines.

---

## 🏗 Architecture

The project follows a standard 3-tier architecture:

```text
+------------------+       HTTP (REST)      +------------------+       JDBC/SQL       +------------------+
|                  |                        |                  |                      |                  |
| Frontend (SPA)   | <====================> | Backend API      | <==================> | Database         |
| Angular 17       |                        | Spring Boot/Java |                      | MySQL 8          |
| Port: 4200       |                        | Port: 8080       |                      | Port: 3306       |
|                  |                        |                  |                      |                  |
+------------------+                        +------------------+                      +------------------+
```

---

## 🚀 How to Run Locally

You will need 3 separate terminal tabs to run all components of the application.

### 1. Database (MySQL)
Ensure MySQL is running on port `3306` with root access. If you haven't already, execute the initialization script to create the schema and seed data.
```bash
mysql -u root -h 127.0.0.1 < database/init.sql
```

### 2. Backend (Spring Boot)
Navigate to the `backend` directory and start the Spring Boot application using Maven. It will run on port `8080`.
```bash
cd backend
mvn spring-boot:run
```

### 3. Frontend (Angular)
Navigate to the `frontend` directory and serve the Angular application. It will run on port `4200`.
```bash
cd frontend
npm install
npm run start
```
*Note: Depending on your environment, you may also use `ng serve`.*

Once everything is running, open your browser and navigate to `http://localhost:4200` to view the storefront!

---

## � API Endpoints

The Spring Boot backend exposes the following RESTful endpoints under `http://localhost:8080/api`:

### Products
- `GET /products`
  - Retrieves a list of all available products.
- `GET /products/{id}`
  - Retrieves details for a specific product by its ID.
- `GET /products/category/{category}`
  - Retrieves a filtered list of products belonging to a specific category.

### Orders
- `POST /orders`
  - Submits a new customer order. Expects an `OrderRequestDto` payload containing customer details and order items.
- `GET /orders`
  - Retrieves a list of all incoming orders (Used by the Admin Dashboard).
- `DELETE /orders/{id}`
  - Deletes a specific order from the system by its ID (Cascades to linked items).
