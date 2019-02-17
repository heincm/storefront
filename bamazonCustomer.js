require("dotenv").config();

const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table3');
const connection = require('./sql')
const log = console.log;

function displayItems() {
    let myQuery = 'SELECT item_id, product, CONCAT ("$", price) AS price FROM products'
    connection.query(myQuery, function (error, results) {
        if (error) throw error;
        log(chalk.blue.bold('\nHere\'s what\'s for sale:\n'));
        let table = new Table({
            head: ['ID', 'Product', 'Price'],
            colWidths: [10, 20, 10]
        });
        results.forEach(el => {
            table.push([`${chalk.blue([el['item_id']])}`, `${chalk.yellow([el['product']])}`, `${chalk.green([el['price']])}`])
        });
        log(table.toString())
        customerInput();
    });
}

function customerInput(arraything) {
    inquirer
        .prompt([
            {
                name: "itemId",
                message: "Please select the product you would like to purchase",
                type: "list",
                choices: function () {
                    return arraything.map(function (el) {
                        return `${el.item_id} || ${el.product} || ${el.price}`
                    })
                }
            },
            {
                name: "numUnits",
                message: `How many would you like to purchase?`,
                type: "input",
                validate: function (input) {
                    if (!isNaN(input) && input.length > 0) {
                        return true;
                    } else {
                        log(' is not a valid respone. Please enter a number');
                    }
                }
            }
        ])
        .then(answers => {
            checkInventory(parseInt(answers.itemId), parseInt(answers.numUnits));
        });
};

function checkInventory(item, quantity) {
    connection.query('SELECT stock_quantity, round(price,2) as price, product_sales FROM products WHERE item_id = ?', [item], function (error, results) {
        if (error) throw error;
        let currentSales = results[0]["product_sales"]
        let currentStock = results[0]["stock_quantity"];
        if (currentStock < quantity) {
            log('Insufficient quantity!');
            start();
        } else {
            connection.query('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?', [(currentStock - quantity), (currentSales + (results[0]["price"] * quantity)), item], function (error, results) {
                if (error) throw error;
            })
            log(chalk`
            {red The total cost of your purchase is} {green $${results[0]["price"] * quantity}}
            `);
            start();
        }
    });
};

function start() {
    inquirer
        .prompt([
            {
                name: "doWhat",
                message: "What would you like to do?",
                type: "list",
                choices: ["Show me what's for sale", "Exit"]
            }
        ])
        .then(answers => {
            if (answers.doWhat === "Show me what's for sale") {
                //displayItems();
                showItems();
            } else {
                connection.end();
                process.exit();
            }
        });
}

function showItems() {
    let myQuery = 'SELECT item_id, product, CONCAT ("$", price) AS price, stock_quantity FROM products WHERE stock_quantity > 0'
    connection.query(myQuery, function (error, results) {
        if (error) throw error;
        let arraything = results.filter((el) => el.stock_quantity > 0)
        customerInput(arraything);
    });
};

connection.connect();
start();
