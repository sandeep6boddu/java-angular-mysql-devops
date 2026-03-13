# MillEats

**MillEats** is a full-stack e-commerce Single Page Application (SPA) designed for a healthy millet snacks brand. It features a modern, responsive storefront with a product catalog, category filtering, a sliding shopping cart, and a complete checkout flow. It also includes an integrated Admin Dashboard for managing customer orders.

This project was specifically built with a standard 3-tier architecture as a sandbox for practicing DevOps processes and CI/CD pipelines.

---

## 🏗 Architecture

```text
+------------------+       HTTP (REST)      +------------------+       JDBC/SQL       +------------------+
|                  |                        |                  |                      |                  |
| Frontend (SPA)   | <===================> | Backend API      | <==================> | Database         |
| Angular 17       |                        | Spring Boot/Java |                      | MySQL 8          |
| Port: 4200       |                        | Port: 8080       |                      | Port: 3306       |
|                  |                        |                  |                      |                  |
+------------------+                        +------------------+                      +------------------+
```

| Service   | Port  | Technology          |
|-----------|-------|---------------------|
| Database  | 3306  | MySQL 8             |
| Backend   | 8080  | Spring Boot 3 / Java 17 |
| Frontend  | 4200 (dev) / 80 (prod) | Angular 17 |

---

## 🖥 Prerequisites

| Tool          | Version  | Download Link                                      |
|---------------|----------|----------------------------------------------------|
| Java JDK      | 17+      | https://adoptium.net/                              |
| Maven         | 3.8+     | https://maven.apache.org/download.cgi              |
| Node.js       | 18+      | https://nodejs.org/                                |
| Angular CLI   | 17+      | `npm install -g @angular/cli`                      |
| MySQL Server  | 8.0+     | https://dev.mysql.com/downloads/mysql/             |
| Git           | latest   | https://git-scm.com/downloads                      |

---

# 🏠 Running Locally (Windows & macOS)

## Step 1 — Install Prerequisites

### macOS (Homebrew)
```bash
brew install openjdk@17 maven mysql node
npm install -g @angular/cli
```

### Windows (Chocolatey — run PowerShell as Admin)
```powershell
choco install temurin17 maven mysql nodejs
npm install -g @angular/cli
```

---

## Step 2 — Clone the Repository

```bash
git clone https://github.com/sandeep6boddu/java-angular-mysql-devops.git
cd java-angular-mysql-devops
```

---

## Step 3 — Start MySQL & Initialize the Database

### macOS
```bash
brew services start mysql
mysql -u root -h 127.0.0.1 < database/init.sql
```

### Windows (PowerShell)
```powershell
net start MySQL80
mysql -u root -h 127.0.0.1 < database\init.sql
```

> **Note:** If your MySQL root user has a password, add the `-p` flag and also update `backend/src/main/resources/application.properties`:
> ```properties
> spring.datasource.password=YOUR_PASSWORD
> ```

---

## Step 4 — Start the Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

Wait until you see:
```
Started MilleatsBackendApplication in X.XXX seconds
```

The API will be available at **http://localhost:8080**.

---

## Step 5 — Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run start
```

The app will be available at **http://localhost:4200**.

---

## Step 6 — Open the App

🌐 Navigate to **http://localhost:4200** in your browser.

### Stopping the App

1. **Frontend** — Press `Ctrl + C` in the frontend terminal.
2. **Backend** — Press `Ctrl + C` in the backend terminal.
3. **MySQL:**
   - macOS: `brew services stop mysql`
   - Windows: `net stop MySQL80`

---

---

# ☁️ Deploying on Ubuntu Server

## Step 1 — Update the System

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 2 — Install Java 17 & Maven

```bash
sudo apt install -y openjdk-17-jdk maven
java -version
mvn -version
```

---

## Step 3 — Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g @angular/cli

node -v
npm -v
```

---

## Step 4 — Install & Configure MySQL 8

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

### Set root password

```bash
sudo mysql
```
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

> **Important:** Update `backend/src/main/resources/application.properties`:
> ```properties
> spring.datasource.password=your_password
> ```

---

## Step 5 — Clone the Repository

```bash
cd /opt
sudo git clone https://github.com/sandeep6boddu/java-angular-mysql-devops.git milleats
sudo chown -R $USER:$USER /opt/milleats
cd /opt/milleats
```

---

## Step 6 — Initialize the Database

```bash
mysql -u root -p -h 127.0.0.1 < database/init.sql
```

Verify:
```bash
mysql -u root -p -e "USE milleats; SHOW TABLES;"
```

---

## Step 7 — Build & Run the Backend

```bash
cd /opt/milleats/backend
mvn clean package -DskipTests
nohup java -jar target/milleats-backend-1.0.0.jar > /var/log/milleats-backend.log 2>&1 &
```

Verify:
```bash
curl http://localhost:8080/api/products
```

### (Optional) Create a Systemd Service

```bash
sudo nano /etc/systemd/system/milleats-backend.service
```

```ini
[Unit]
Description=MillEats Spring Boot Backend
After=mysql.service
Requires=mysql.service

[Service]
User=ubuntu
WorkingDirectory=/opt/milleats/backend
ExecStart=/usr/bin/java -jar /opt/milleats/backend/target/milleats-backend-1.0.0.jar
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable milleats-backend
sudo systemctl start milleats-backend
sudo systemctl status milleats-backend
```

---

## Step 8 — Build the Frontend & Set Up Nginx

### Build for production

```bash
cd /opt/milleats/frontend
npm install
ng build --configuration production
```

### Install & Configure Nginx

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/milleats
```

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /opt/milleats/frontend/dist/frontend/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/milleats /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 9 — Open the Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## Step 10 — Access the App

🌐 Navigate to **http://your_server_ip** in your browser.

---

## Useful Server Commands

```bash
# Backend logs
sudo journalctl -u milleats-backend -f

# Restart services
sudo systemctl restart milleats-backend
sudo systemctl restart nginx

# Re-initialize database
mysql -u root -p -h 127.0.0.1 < /opt/milleats/database/init.sql

# Check all services
sudo systemctl status milleats-backend mysql nginx
```

---

## 🔗 API Endpoints

The backend exposes the following RESTful endpoints under `http://localhost:8080/api`:

### Products
- `GET /products` — Retrieves all products.
- `GET /products/{id}` — Retrieves a specific product.
- `GET /products/category/{category}` — Retrieves products by category.

### Orders
- `POST /orders` — Submits a new order.
- `GET /orders` — Retrieves all orders (Admin Dashboard).
- `DELETE /orders/{id}` — Deletes an order.

---

## 🔧 Troubleshooting

| Issue                           | Solution                                                        |
|---------------------------------|-----------------------------------------------------------------|
| MySQL connection refused        | Ensure MySQL is running and check the password in `application.properties` |
| Backend won't start             | Check logs: `sudo journalctl -u milleats-backend -f`           |
| Nginx 502 Bad Gateway           | Backend is not running or not on port 8080                      |
| Frontend blank page             | Verify build output exists in `dist/frontend/browser/`          |
| Port already in use             | Find the process: `lsof -i :8080` (mac) or `sudo lsof -i :8080` (ubuntu) |
