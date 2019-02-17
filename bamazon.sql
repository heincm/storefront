DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id int NOT NULL AUTO_INCREMENT,
product VARCHAR(255) NOT NULL,
department VARCHAR(255) NOT NULL,
price DECIMAL(10,2),
stock_quantity INT (10) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("shoes", "clothing", 50.99, 87),
("polo", "clothing", 12.49, 92),
("hat", "clothing", 10.99, 14),
("headphones", "electronics", 24.87, 33),
("iPhone", "electronics", 999.99, 65),
("smart watch", "electronic", 299.99, 34),
("tent", "sporting goods", 77.85, 23),
("fishing pole", "sporting goods", 37.88, 18),
("camp stove", "sporting goods", 47.77, 88),
("band aids", "pharmacy", 1.99, 93);

use bamazon_db;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(255),
    over_head_costs DECIMAL(10, 2),
    PRIMARY KEY (department_id)
)

use bamazon_db;
ALTER TABLE products
ADD product_sales Decimal (10, 2);