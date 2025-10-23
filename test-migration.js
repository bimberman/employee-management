const { Pool } = require('pg');
require('dotenv').config();

// Test database connection and migration
async function testMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'employee_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  const client = await pool.connect();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    console.log('✓ Current time:', result.rows[0].now);
    
    // Test employee count
    const empCount = await client.query('SELECT COUNT(*) FROM employees');
    console.log(`✓ Employee count: ${empCount.rows[0].count}`);
    
    // Test sample employee data
    const sampleEmp = await client.query('SELECT * FROM employees LIMIT 1');
    if (sampleEmp.rows.length > 0) {
      console.log('✓ Sample employee data:');
      console.log(`  - Name: ${sampleEmp.rows[0].first_name} ${sampleEmp.rows[0].last_name}`);
      console.log(`  - Email: ${sampleEmp.rows[0].email}`);
      console.log(`  - Salary: ${sampleEmp.rows[0].salary}`);
    }
    
    // Test relationships
    const deptTest = await client.query(`
      SELECT e.first_name, e.last_name, d.department_name 
      FROM employees e 
      JOIN departments d ON e.department_id = d.department_id 
      LIMIT 3
    `);
    console.log('✓ Department relationships working:');
    deptTest.rows.forEach(emp => {
      console.log(`  - ${emp.first_name} ${emp.last_name} works in ${emp.department_name}`);
    });
    
    console.log('\n🎉 Migration test completed successfully!');
    console.log('The database is ready for use.');
    
  } catch (error) {
    console.error('❌ Migration test failed:', error.message);
    console.error('Please check your database configuration and ensure PostgreSQL is running.');
  } finally {
    client.release();
    await pool.end();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testMigration();
}

module.exports = { testMigration };
