const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'employee_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function migrateData() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration from JSON to PostgreSQL...');
    
    // Read the JSON data
    const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    console.log(`Found ${jsonData.length} employees to migrate`);
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing employee data...');
    await client.query('DELETE FROM employees');
    
    // Insert employees
    console.log('Inserting employees...');
    for (const employee of jsonData) {
      const query = `
        INSERT INTO employees (
          employee_id, first_name, last_name, email, phone_number, 
          hire_date, job_id, salary, commission_pct, manager_id, 
          department_id, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (employee_id) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          email = EXCLUDED.email,
          phone_number = EXCLUDED.phone_number,
          hire_date = EXCLUDED.hire_date,
          job_id = EXCLUDED.job_id,
          salary = EXCLUDED.salary,
          commission_pct = EXCLUDED.commission_pct,
          manager_id = EXCLUDED.manager_id,
          department_id = EXCLUDED.department_id,
          image_url = EXCLUDED.image_url
      `;
      
      const values = [
        employee.id,
        employee.name,
        employee.lastName,
        employee.email,
        employee.phone_number,
        new Date(employee.hire_date),
        employee.job_id,
        employee.salary,
        employee.commission_pct && employee.commission_pct !== "" ? parseFloat(employee.commission_pct) : null,
        employee.parentId && employee.parentId !== "" ? parseInt(employee.parentId) : null,
        employee.department_id,
        employee.image
      ];
      
      await client.query(query, values);
    }
    
    console.log('Migration completed successfully!');
    console.log(`Migrated ${jsonData.length} employees to PostgreSQL`);
    
    // Verify the migration
    const result = await client.query('SELECT COUNT(*) FROM employees');
    console.log(`Total employees in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function createDatabase() {
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });
  
  const client = await adminPool.connect();
  
  try {
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'employee_management']
    );
    
    if (result.rows.length === 0) {
      console.log('Creating database...');
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'employee_management'}`);
      console.log('Database created successfully!');
    } else {
      console.log('Database already exists');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    client.release();
    await adminPool.end();
  }
}

async function setupSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up database schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema setup completed!');
  } catch (error) {
    console.error('Error setting up schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await createDatabase();
    await setupSchema();
    await migrateData();
    console.log('All migration steps completed successfully!');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { migrateData, createDatabase, setupSchema };
