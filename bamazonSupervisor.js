require("dotenv").config();

const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table3');
const connection = require('./sql')
const log = console.log


function start() {
    inquirer
        .prompt([
            {
                name: "doWhat",
                message: "What would you like to do?",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"]
            }
        ])
        .then(answers => {
            switch (answers.doWhat) {
                case "View Product Sales by Department":
                    viewProdcuts();
                    break;
                case "Create New Department":
                    createDepartment();
                    break;
                default:
                    connection.end();
                    process.exit();
            }
        });
};

function viewProdcuts() {
    let myQuery = 'SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales), sum(p.product_sales - d.over_head_costs) as total_profit FROM departments d JOIN products p on d.department_name = p.department Group By d.department_id, d.department_name, d.over_head_costs'
    connection.query(myQuery, function (error, results) {
        if (error) throw error;
        let table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
            colWidths: [20, 20, 20, 20, 20]
        });
        results.forEach(el => {
            table.push([`${chalk.blue([el['department_id']])}`, `${chalk.yellow([el['department_name']])}`, `${chalk.green('$'+[el['over_head_costs']])}`, `${chalk.magenta('$'+[el['sum(p.product_sales)']])}`, `${chalk.cyan('$'+[el['total_profit']])}`])
        });
        log(table.toString());
        start();
    });
};

function createDepartment() {
    inquirer
        .prompt([
            {
                name: "department",
                message: "What is the department you would like to add?",
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
                name: "overhead",
                message: "What are the overhead costs for this department?",
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
            connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)', [answers.department, answers.overhead], function (error, results) {
                if (error) throw error;
                log(answers.department +' has been added with an overhead cost of $' + answers.overhead);
                start();
            })

        })
};

connection.connect();
start();

