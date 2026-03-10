-- MillEats Database Initialization Script
-- Creates the database, products table, and seeds sample data

CREATE DATABASE IF NOT EXISTS milleats;
USE milleats;

-- Drop table if exists for clean re-initialization
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed Data: Millet Cookies
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Choco Chip Millet Cookies', 'Delicious millet cookies loaded with rich chocolate chips. A guilt-free treat packed with fiber and natural goodness.', 199.00, 'Millet Cookies', '/assets/products/choco-chip-cookies.webp', TRUE),
('Butter Nut Millet Cookies', 'Crunchy butter nut millet cookies made with wholesome millets and premium nuts. Perfect for tea-time snacking.', 219.00, 'Millet Cookies', '/assets/products/butter-nut-cookies.webp', TRUE),
('Cashew Nut Millet Cookies', 'Premium millet cookies enriched with roasted cashew nuts. A protein-rich snack for health-conscious foodies.', 249.00, 'Millet Cookies', '/assets/products/cashew-nut-cookies.webp', TRUE);

-- Seed Data: Millet Bars
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Dry Fruits Millet Bar', 'Energy-packed millet bar loaded with almonds, cashews, and raisins. The perfect on-the-go healthy snack.', 179.00, 'Millet Bars', '/assets/products/dry-fruits-bar.webp', TRUE),
('Peanut Chikki Millet Bar', 'Traditional chikki reimagined with millets and crunchy peanuts. A high-protein energy booster.', 149.00, 'Millet Bars', '/assets/products/peanut-chikki-bar.webp', TRUE),
('Crunch Millet Energy Bar', 'Crispy millet energy bar with a satisfying crunch. Gluten-free and perfect for pre or post workout fuel.', 169.00, 'Millet Bars', '/assets/products/crunch-energy-bar.webp', TRUE);

-- Seed Data: Millet Crunchies
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Tomato Millet Crunchies', 'Baked millet crunchies with a tangy tomato twist. A healthier alternative to regular chips, with zero preservatives.', 129.00, 'Millet Crunchies', '/assets/products/tomato-crunchies.webp', TRUE),
('Cream & Onion Millet Crunchies', 'Irresistible cream and onion flavored baked millet chips. Light, crispy, and full of wholesome millet goodness.', 129.00, 'Millet Crunchies', '/assets/products/cream-onion-crunchies.webp', TRUE),
('Masala Millet Crunchies', 'Spicy masala millet crunchies with a bold Indian flavor. Baked, not fried — for a healthier snacking experience.', 129.00, 'Millet Crunchies', '/assets/products/masala-crunchies.webp', TRUE);

-- Seed Data: Millet Puffs
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Chia Puffs', 'Crunchy millet puffs with organic chia seeds. A fiber-rich, high-protein snack that is baked and gluten-free.', 159.00, 'Millet Puffs', '/assets/products/chiapuffs.png', TRUE);
