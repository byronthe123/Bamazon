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


//---------------------------------------- DATABASE METHODS START --------------------------------------//

const getDataTable = (res) => {
    let headingsArray = [];
    let colWidthsArray = [];

    // Get headings:
    for(let key in res[0]) {
        headingsArray.push(key);
        colWidthsArray.push(25);
    }

    let dataTable = new cliTable({
        head: headingsArray,
        colWidths: colWidthsArray
    });

    // Get values:
    for(let i = 0; i < res.length; i++) {
        let rowArray = [];
        for(let key in res[i]) {
            if(res[i][key] === null) {
                rowArray.push('null');
            } else {
                rowArray.push(res[i][key]);
            }
        }
        dataTable.push(rowArray);
    }
    return dataTable;
}

const viewSalesByDept = () => {
    connection.query(`
    SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, SUM(products.product_sales) - departments.over_head_costs AS profit FROM departments
    LEFT JOIN products
    ON departments.department_id = products.department_id
    GROUP BY departments.department_id
    ORDER BY departments.department_id;`, 
    {}, 
    (err, res) => {
        if(err) {
            console.log(err);
        } else {
            const dataTable = getDataTable(res);
            console.log(dataTable.toString());
            superPrompt();
        }
    });
}

const createNewDept = (name, overhead) => {
    connection.query(`
    INSERT INTO departments(department_name, over_head_costs)
    VALUES('${name}', ${parseInt(overhead)})`, 
    {}, 
    (err, res) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Department successfully added: ${name}`);
        }
        setTimeout(() => {
            superPrompt();
        }, 1500);
    });
}

const viewDepartments = () => {
    connection.query(`SELECT * FROM departments`, {}, (err, res) => {
        if(err) {
            console.log(err);
        } else {
            const dataTable = getDataTable(res);
            console.log(dataTable.toString());
            superPrompt();
        }
    });
}

//---------------------------------------- DATABASE METHODS END --------------------------------------//

//---------------------------------------- INQUIRER METHODS START -----------------------------------//

const superPrompt = () => {
    inquirer.prompt({
        type: 'list',
        name: 'superAction',
        choices: ['View Product Sales by Department', 'Create New Department', 'View Departments'],
        message: '\n======SUPERVISOR TERIMNAL=======\nWhat would you like to do: '
    }).then(answer => {
        switch(answer.superAction) {
            case 'View Product Sales by Department':
                viewSalesByDept()
                break;
            case 'Create New Department':
                createNewDeptPrompt();
                break;
            case 'View Departments':
                viewDepartments();
                break;
        }
    })
}

const createNewDeptPrompt = () => {
    inquirer.prompt([
        {
            type: 'string',
            message: 'Please enter the department name: ',
            name: 'name'
        },
        {
            type: 'string',
            message: 'Please enter the over head costs for this apartment: ',
            name: 'overhead',
            validate: function(input) {
                if(isNaN(parseInt(input))) {
                    return `Please enter a number value.`
                } else {
                    return true;
                }
            }
        }
    ]).then(answers => {
        createNewDept(answers.name, answers.overhead);
    });
}

//---------------------------------------- INQUIRER METHODS END -----------------------------------//

superPrompt();
