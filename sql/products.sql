DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    department_id INT NOT NULL, 
    price DECIMAL(8, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(10, 2),
    PRIMARY KEY (item_id)
);

-- ALTER TABLE products
-- ADD product_sales DECIMAL;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('PlayStation 4', 'Electronics', 299.00, 500);
