# Bamazon

This is CLI Node program that provides terminals to Customers, Managerers, and Supervisors to be able to view, buy, and manage products/departments. This program uses MySQL to persist data.

  

## Getting Started

  

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

  

### Prerequisites

The following must be installed on your machine:

  

- Git Bash

- NodeJS

- NPM

- MySQL Server 8.0

  

### Installing Dependencies

Use NPM to install all required dependencies:

  

`npm install`

  

## Running the App

  

Use the following command to start the app:

  

`node bamazonCustomer.js` or `node bamazonmanager.js` or `node bamazonSupervisor.js`

  

## Using the App:

### Demo:

Please view the video demo below:

[Video](https://drive.google.com/open?id=1wz0x_GQMPqlSjufp4Y4mNfdKd2JOm8Mw)

Users interact with the app by selecting the commands prompted by **inquirer.js** and then typing in the product id to purchase products/add inventory or type in whatever inforamation is required to add new products or departments.

## Programming Methodology

  

### Approach

Based on the directions, the program is split into three files: bamazoncustomer.js, bamazonmanager.js, and bamazonsupervisor.js. Bamazoncustomer.js allows customers to purchase products, which updates the product's `stock_quantity` and `product_sales`. Bamazonmanager.js allows the manager to view low inventory, add stock, and add new products. Each of these transactions is accomplished with a query. The Bamazonsupervisor.js program allows new departments to be created and allows the supervisor to view sales and profit by department. This is accomplished with a join query for which a `department_id` field was added to both product and department tables (to avoid joining on product_name). To format the table displayed by bamazonsupervisor, **cli-table** was used. 

## Built With

  
- NodeJS

- NPM

- Inquirer

- Cli-table

- MySQL (NPM package)

- MySQL Server

- MySQL Workbench


## Syntax and Conventions

The app is written in ES6. 
