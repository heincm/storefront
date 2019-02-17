require("dotenv").config();

const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table3');
const connection = require('./sql')
const log = console.log

function viewProducts() {
    connection.query('SELECT * FROM products', function (error, results) {
        if (error) throw error;
        let table = new Table({
            head: ['ID', 'Product', 'Price', 'Quantity'],
            colWidths: [10, 20, 10]
        });
        results.forEach(el => {
            table.push([`${chalk.blue([el['item_id']])}`, `${chalk.yellow([el['product']])}`, `${chalk.green(['$' + el['price']])}`, `${chalk.magenta([el['stock_quantity']])}`])
        });
        log(table.toString())
        askCommand();
    });
};

function viewLow() {
    connection.query('SELECT item_id, product, stock_quantity FROM products WHERE stock_quantity < 5', function (error, results) {
        if (error) throw error;
        if (results.length === 0) {
            log('There are no low inventory items at this time.')

        } else {
            log(chalk.bold.blue('ID:'), chalk.bold.yellow('Product:'), chalk.bold.green('Quantity:'))
            results.forEach(element => {
                log(chalk.blue(element['item_id']), chalk.yellow(element['product']), chalk.green(element['stock_quantity']), "\n")
            })
        };
        askCommand();
    });
};

function addInventory(arg) {
    inquirer
        .prompt([
            {
                name: "itemId",
                message: "Please select the product you would like to add more of.",
                type: "list",
                choices: function () {
                    return arg.map(function (el) {
                        return `${el.item_id} || ${el.product} || ${el.price}`
                    })
                }
            },
            {
                name: "itemCount",
                message: "How many of these would you like to add to the inventory?",
                type: "input",
                validate: function (input) {
                    if (!isNaN(input) && input.length > 0) {
                        return true;
                    } else {
                        log(' is not a valid response. Please enter a number')
                    }
                }
            }
        ])
        .then(answers => {
           updateProduct(parseInt(answers.itemId), parseInt(answers.itemCount));
        });
};

function addNew() {
    inquirer
        .prompt([
            {
                name: "addWhat",
                message: "What is the product you would like to add?",
                type: "input",
                validate: function (input) {
                    if (input.length) {
                        return true;
                    } else {
                        log(' is not a valid response. Please enter a number')
                    }
                }
            },
            {
                name: "count",
                message: "How many of these would you like to add to the inventory?",
                type: "input",
                validate: function (input) {
                    if (!isNaN(input) && input.length > 0) {
                        return true;
                    } else {
                        log(' is not a valid response. Please enter a number')
                    }
                }
            },
            {
                name: "department",
                message: "What department does this item belong to?",
                type: "input",
                validate: function (input) {
                    if (isNaN(input) && input.length > 0) {
                        return true;
                    } else {
                        log(' is not a valid response. Please enter a number')
                    }
                }
            },
            {
                name: "cost",
                message: "Enter a price for this item",
                type: "input",
                validate: function (input) {
                    if (!isNaN(input) && input.length > 0) {
                        return true;
                    } else {
                        log(' is not a valid response. Please enter a number')
                    }
                }
            }

        ])
        .then(answers => {
            connection.query('INSERT INTO products(product, department, price, stock_quantity) VALUES (?,?,?,?)', [answers.addWhat, answers.department, answers.cost, answers.count], function (error, results) {
                if (error) throw error;
                log(`Your new inventory has been added`);
                askCommand();
            });
        });
};

function askCommand() {
    inquirer
        .prompt([
            {
                name: "command",
                message: "What would you like to do?",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
            }
        ])
        .then(answers => {
            switch (answers.command) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLow();
                    break;
                case "Add to Inventory":
                    getInfo();
                    break;
                case "Add New Product":
                    addNew();
                    break;
                case "Exit":
                    connection.end();
                    process.exit();
                    break;
                default: log('Please select a command');
            }
        });
}

function getInfo() {
    let myQuery = 'SELECT * FROM products'
    connection.query(myQuery, function (error, results) {
        if (error) throw error;
        let arg = results.map(function (el) {
            return (el)
        });
        addInventory(arg)
    });
}

function updateProduct(item, quantity){
    connection.query('SELECT stock_quantity FROM products WHERE item_id = ?', [item], function (error, results) {
        if (error) throw error;
        let currentStock = results[0]["stock_quantity"];
        connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [(currentStock + quantity), item], function (error, results) {
            if (error) throw error;
            log(`
            There are now ${currentStock + quantity} of this item in stock
            `);
            askCommand();
        });

    });
}

connection.connect();
askCommand();