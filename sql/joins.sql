USE bamazon;

SELECT products.product_name, departments.department_name FROM products
JOIN departments 
ON products.department_name = departments.department_name;

-- 

USE bamazon;

SELECT  DISTINCT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, products.product_sales - departments.over_head_costs AS profit FROM departments
JOIN products
ON departments.department_name = products.department_name;

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales), products.product_sales - departments.over_head_costs AS profit FROM departments
LEFT JOIN products
ON departments.department_id = products.department_id
GROUP BY products.department_id;