require("dotenv").config();

const inquirer = require('inquirer');
const chalk = require('chalk');
const connection = require('./sql')
const log = console.log;

customerInput = (itemArray) => {
    inquirer
        .prompt([
            {
                name: "itemId",
                message: "Please select the product you would like to purchase",
                type: "list",
                choices: function () {
                    return itemArray.map(function (el) {
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

checkInventory = (item, quantity) => {
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

start = () => {
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
                showItems();
            } else {
                connection.end();
                process.exit();
            }
        });
}

showItems = () => {
    let myQuery = 'SELECT item_id, product, CONCAT ("$", price) AS price, stock_quantity FROM products WHERE stock_quantity > 0'
    connection.query(myQuery, function (error, results) {
        if (error) throw error;
        let inventoryArray = results.filter((el) => el.stock_quantity > 0)
        customerInput(inventoryArray);
    });
};

connection.connect();
start();
