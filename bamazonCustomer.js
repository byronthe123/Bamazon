const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('D://Documents//Columbia Engineering/password.json');
const cliTable = require('cli-table');

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
    // console.log(`Connected as ${connection.threadId}`);
});

const logResponseFormatted = (res) => {
    for(let i = 0; i < res.length; i++) {
        console.log(`Product ID: ${res[i].item_id}\nProduct Name: ${res[i].product_name}\nPrice: $${res[i].price}.00\nStock Quantity: ${res[i].stock_quantity}\n`);
    }
}

const updateStock = (item_id, quantity, sale) => {
    connection.query(`
    UPDATE products SET ? WHERE ?`, 
    [
        {
            stock_quantity: quantity
        }, 
        {
            item_id: item_id
        },
    ],
    (err, res) => {
        if(err) {
            console.log(err);
        }
        updateSales(sale, item_id);
    });
}

const readDB = () => {
    connection.query(`SELECT * FROM products`, {}, (err, res) => {
        if(err) {
            console.log(err);
        } else {
            logResponseFormatted(res);
            getProductID();
        }
    });
}

const selectByID = (item_id) => {
    connection.query(`
    SELECT * FROM products WHERE ?`, 
    {
        item_id: item_id
    }, 
    (err, res) => {
        if(err) {
            console.log(err);
            runApp();
        } else if (res.length < 1) {
            console.log(`Item not found - please check recheck entry.`);
            setTimeout(() => {
                runApp();
            }, 1500);
        } else {
            logResponseFormatted(res);
            getPurchaseQuantity(item_id);
        }
    });
}

const updateSales = (sale, item_id) => {
    connection.query(`
    UPDATE products SET ? WHERE ?`, 
    [
        {
            product_sales: sale
        },
        {
            item_id: item_id
        }
    ], 
    (err, res) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Sales updated`);
            runApp();
        }
    });
}

const attemptPurchase = (item_id, quantity) => {
    connection.query(`
    SELECT product_name, stock_quantity, price FROM products WHERE ?`, 
    {
        item_id: item_id
    }, 
    (err, res) => {
        if(res[0].stock_quantity >= quantity) {
            const remainingStock = res[0].stock_quantity - quantity;
            const sale = res[0].price * quantity;
            console.log(`You have bought ${quantity} ${res[0].product_name} unit(s).\nYour total is $${sale}`);
            setTimeout(() => {
                updateStock(item_id, remainingStock, sale);
            }, 3000);
        } else {
            console.log(`Invalid purchase quantity - there are only ${res[0].stock_quantity} units in stock.`);
            getPurchaseQuantity(item_id);
        }
    });
}

//---------------------------------------- DATABASE METHODS END--------------------------------------//

//---------------------------------------- INQUIRER METHODS START -----------------------------------//

const runApp = () => {
    readDB();
}

const getProductID = () => {
    inquirer.prompt({
        type: 'string',
        message: '\n====== POINT OF SALE ======\nWhich item would you like to buy? Enter the ID: ',
        name: 'item_id'
    }).then(response => {
        selectByID(response.item_id);
    })
}

const getPurchaseQuantity = (item_id) => {
    inquirer.prompt({
        type: 'string',
        message: 'How many units would you like to buy?',
        name: 'purchaseQuantity'
    }).then(res => {
        attemptPurchase(item_id, res.purchaseQuantity);
    })
}

runApp();

