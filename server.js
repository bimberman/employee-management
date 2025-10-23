const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'employee_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Helper function to convert database row to frontend format
function convertEmployeeToFrontend(dbEmployee) {
  return {
    id: dbEmployee.employee_id,
    parentId: dbEmployee.manager_id || "",
    name: dbEmployee.first_name,
    lastName: dbEmployee.last_name,
    position: dbEmployee.job_title || "",
    image: dbEmployee.image_url || "https://bumbeishvili.github.io/avatars/avatars/portrait1.png",
    email: dbEmployee.email,
    phone_number: dbEmployee.phone_number || "",
    hire_date: dbEmployee.hire_date ? new Date(dbEmployee.hire_date).toISOString() : new Date().toISOString(),
    job_id: dbEmployee.job_id || "",
    salary: dbEmployee.salary || 0,
    commission_pct: dbEmployee.commission_pct || "",
    department_id: dbEmployee.department_id || 0,
    job_min_salary: dbEmployee.min_salary || 0,
    location_state: dbEmployee.state_province || "",
    job_max_salary: dbEmployee.max_salary || 0,
    department_name: dbEmployee.department_name || "",
    department_location_id: dbEmployee.location_id || 0,
    department_location_street_address: dbEmployee.street_address || "",
    department_location_postal_code: dbEmployee.postal_code || 0,
    department_location_country_id: dbEmployee.country_id || "",
    department_location_country_name: dbEmployee.country_name || "",
    department_location_country_region_id: dbEmployee.region_id || 0,
    department_location_country_region_name: dbEmployee.region_name || ""
  };
}

// API Routes

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.*,
        j.job_title,
        j.min_salary,
        j.max_salary,
        d.department_name,
        l.street_address,
        l.postal_code,
        l.state_province,
        c.country_id,
        c.country_name,
        r.region_id,
        r.region_name
      FROM employees e
      LEFT JOIN jobs j ON e.job_id = j.job_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN locations l ON d.location_id = l.location_id
      LEFT JOIN countries c ON l.country_id = c.country_id
      LEFT JOIN regions r ON c.region_id = r.region_id
      ORDER BY e.employee_id
    `;
    
    const result = await pool.query(query);
    const employees = result.rows.map(convertEmployeeToFrontend);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        e.*,
        j.job_title,
        j.min_salary,
        j.max_salary,
        d.department_name,
        l.street_address,
        l.postal_code,
        l.state_province,
        c.country_id,
        c.country_name,
        r.region_id,
        r.region_name
      FROM employees e
      LEFT JOIN jobs j ON e.job_id = j.job_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN locations l ON d.location_id = l.location_id
      LEFT JOIN countries c ON l.country_id = c.country_id
      LEFT JOIN regions r ON c.region_id = r.region_id
      WHERE e.employee_id = $1
    `;
    
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const employee = convertEmployeeToFrontend(result.rows[0]);
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, lastName, position, department_name, salary } = req.body;
    
    // Get next available ID
    const idResult = await pool.query('SELECT MAX(employee_id) as max_id FROM employees');
    const nextId = (idResult.rows[0].max_id || 0) + 1;
    
    // Find job_id for the position (simplified - you might want to improve this)
    const jobQuery = await pool.query('SELECT job_id FROM jobs WHERE job_title ILIKE $1 LIMIT 1', [`%${position}%`]);
    const jobId = jobQuery.rows.length > 0 ? jobQuery.rows[0].job_id : 'AD_ASST';
    
    // Find department_id for the department_name
    const deptQuery = await pool.query('SELECT department_id FROM departments WHERE department_name ILIKE $1 LIMIT 1', [`%${department_name}%`]);
    const departmentId = deptQuery.rows.length > 0 ? deptQuery.rows[0].department_id : 10;
    
    const query = `
      INSERT INTO employees (
        employee_id, first_name, last_name, email, phone_number, 
        hire_date, job_id, salary, commission_pct, manager_id, 
        department_id, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      nextId,
      name,
      lastName,
      `${name.toUpperCase()}${lastName.toUpperCase()}`,
      '',
      new Date(),
      jobId,
      parseInt(salary),
      null,
      null,
      departmentId,
      "https://bumbeishvili.github.io/avatars/avatars/portrait1.png"
    ];
    
    const result = await pool.query(query, values);
    const newEmployee = convertEmployeeToFrontend(result.rows[0]);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, position, department_name, salary } = req.body;
    
    // Find job_id for the position
    const jobQuery = await pool.query('SELECT job_id FROM jobs WHERE job_title ILIKE $1 LIMIT 1', [`%${position}%`]);
    const jobId = jobQuery.rows.length > 0 ? jobQuery.rows[0].job_id : 'AD_ASST';
    
    // Find department_id for the department_name
    const deptQuery = await pool.query('SELECT department_id FROM departments WHERE department_name ILIKE $1 LIMIT 1', [`%${department_name}%`]);
    const departmentId = deptQuery.rows.length > 0 ? deptQuery.rows[0].department_id : 10;
    
    const query = `
      UPDATE employees 
      SET first_name = $1, last_name = $2, job_id = $3, salary = $4, department_id = $5
      WHERE employee_id = $6
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, lastName, jobId, parseInt(salary), departmentId, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const updatedEmployee = convertEmployeeToFrontend(result.rows[0]);
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM employees WHERE employee_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('API endpoints:');
  console.log('  GET    /api/employees     - Get all employees');
  console.log('  GET    /api/employees/:id - Get employee by ID');
  console.log('  POST   /api/employees     - Create new employee');
  console.log('  PUT    /api/employees/:id - Update employee');
  console.log('  DELETE /api/employees/:id - Delete employee');
  console.log('  GET    /api/health        - Health check');
});
