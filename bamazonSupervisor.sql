use bamazon_db;
SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales), sum(p.product_sales - d.over_head_costs) as total_profit
    FROM departments d
        JOIN products p on d.department_name = p.department
   Group By d.department_id, d.department_name, d.over_head_costs