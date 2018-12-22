const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('D://Documents//Columbia Engineering/password.json');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: password.password,
    database: 'bamazon'
});

connection.connect((err) => {
    if(err) {
        console.log(`Connection error: ${err}`);
    }
    console.log(`Connected as ${connection.threadId}`);
});

//---------------------------------------- HELPER METHODS START --------------------------------------//
const logResponseFormatted = (res) => {
    for(let i = 0; i < res.length; i++) {
        console.log(`Product ID: ${res[i].item_id}\nProduct Name: ${res[i].product_name}\nPrice: $${res[i].price}.00\nStock Quantity: ${res[i].stock_quantity}\n`);
    }
}

const delay = (method, time) => {
    setTimeout(() => {
        method();
    }, time)
}

//---------------------------------------- HELPER METHODS END --------------------------------------//

//---------------------------------------- DATABASE METHODS START --------------------------------------//

const readDB = () => {
    connection.query(`SELECT * FROM products`, {}, (err, res) => {
        if(err) {
            console.log(err);
        }
        for(let i = 0; i < res.length; i++) {
            let string = '';
            for(let key in res[i]) {
                string += `${key}: ${res[i][key]}\n`;
            }
            console.log(string);
        }
        menu();
    });
}

const lowInventory = () => {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, {}, (err, res) => {
        if(err) {
            console.log(err);
        } else {
            let wait = 1500;
            if(res.length < 1) {
                console.log(`No products to display`);
            } else {
                console.log('\n------- Low Inventory Products ------\n')
                logResponseFormatted(res);
                wait *= 2;
            }
            delay(menu, wait);
        }  
    });
}

const validateID = (item_id) => {
    connection.query(`
    SELECT * FROM products WHERE ?`, 
    {
        item_id: item_id
    }, 
    (err, res) => {
        if(err) {
            console.log(err);
        } else {
            if (res.length < 1) {
                console.log(`Product for the following id not found: ${item_id}.`);
                delay(menu, 1500);
            } else {
                logResponseFormatted(res);
                const currentQuantity = res[0].stock_quantity;
                // console.log(currentQuantity);
                addToIventoryPromptQuantity(item_id, currentQuantity);
            }
        }
    })
}

const addToInventory = (item_id, currentQuantity, addQuantity) => {
    // console.log(`${item_id}, ${quantity}`);
    connection.query(`UPDATE products SET ? WHERE ?`, 
    [
        {
            stock_quantity: (parseInt(currentQuantity) + parseInt(addQuantity))
        },
        {
            item_id: item_id
        }
    ], 
    (err, res) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Successfully added ${addQuantity} units to product #${item_id}.`);
        }
        delay(menu, 1500);
    });
}

const addNewProduct = (productObj) => {
    connection.query(`
    INSERT INTO products(product_name, department_name, department_id, price, stock_quantity)
    VALUES('${productObj.name}', '${productObj.dept}', ${parseInt(productObj.deptId)}, ${parseFloat(productObj.price)}, ${parseInt(productObj.stock)});`, 
    {}, 
    (err, res) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Product successfully added to the database.`);
        }
        delay(menu, 1500);
    });
}

//---------------------------------------- DATABASE METHODS END--------------------------------------//

//---------------------------------------- INQUIRER METHODS START -----------------------------------//

const addToIventoryPromptID = () => {
    inquirer.prompt({
        type: 'string',
        message: 'Which item would you like to order more inventory for? Enter the ID: ',
        name: 'item_id'
    }).then(response => {
        validateID(response.item_id);
    })
}

const addToIventoryPromptQuantity = (item_id, currentQuantity) => {
    inquirer.prompt({
        type: 'string',
        message: 'How many units would you like to order?',
        name: 'quantity' 
    }).then(answer => {
        addToInventory(item_id, currentQuantity, answer.quantity);
    });
}

const addNewProductPrompt = () => {
    inquirer.prompt([
        {
            type: 'string',
            message: 'Enter the product Name: ',
            name: 'name'
        },
        {
            type: 'string',
            message: `Enter the product's Department Name: `,
            name: 'dept'
        },
        {
            type: 'string',
            message: `Enter the product's Department ID: `,
            name: 'deptId',
            validate: function(input) {
                if(isNaN(parseInt(input)) || input.includes('.')) {
                    return `Invalid input`;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'string',
            message: 'Enter the product Price: ',
            name: 'price',
            validate: function(input) {
                if(isNaN(parseFloat(input))) {
                    return `Invalid input - please enter a whole number or decimal value`;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'string',
            message: `Enter the product's initial stock quantity: `,
            name: 'stock',
            validate: function(input) {
                if(isNaN(parseInt(input)) || input.includes('.')) {
                    return `Invalid input`;
                } else {
                    return true;
                }
            }
        }
    ]).then(answers => {
        // console.log(answers);
        addNewProduct(answers);
    })
}

const menu = () => {
    inquirer.prompt({
        type: 'list',
        message: '\n======MAIN MENU=====\n',
        choices: ['View Products for Sale', 'View Low Inventory','Add to Inventory', 'Add New Product'],
        name: 'selection'
    }).then(options => {
        switch(options.selection) {
            case 'View Products for Sale':
                readDB(); 
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addToIventoryPromptID(); 
                break;
            case 'Add New Product':
                addNewProductPrompt();
                break;
        }
    })
}

//---------------------------------------- INQUIRER METHODS END -----------------------------------//


menu();