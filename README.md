# Employee Management System

A modern employee management system with PostgreSQL database integration.

## Features

- View, create, edit, and delete employees
- PostgreSQL database backend
- RESTful API
- Modern web interface
- Real-time data synchronization

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-grade-table
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Install PostgreSQL on your system
   - Create a database user (or use the default postgres user)
   - Note your database credentials

4. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employee_management
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   PORT=3000
   ```

5. **Run the migration**
   ```bash
   npm run migrate
   ```
   
   This will:
   - Create the database if it doesn't exist
   - Set up the database schema
   - Migrate data from `db.json` to PostgreSQL

6. **Start the application**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## Development

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/health` - Health check

## Database Schema

The application uses a normalized PostgreSQL schema with the following main tables:

- `employees` - Employee information
- `departments` - Department data
- `jobs` - Job positions and salary ranges
- `locations` - Office locations
- `countries` - Country information
- `regions` - Geographic regions

## Migration from JSON

The migration script (`migrate.js`) automatically:
1. Creates the PostgreSQL database
2. Sets up the schema with proper relationships
3. Transfers all data from `db.json` to PostgreSQL
4. Maintains data integrity and relationships

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check your database credentials in `.env`
- Verify the database exists and is accessible

### Migration Issues
- Make sure PostgreSQL is running before running migration
- Check that the database user has CREATE DATABASE privileges
- Review the migration logs for specific error messages

### Application Issues
- Check the server logs for error messages
- Ensure all dependencies are installed (`npm install`)
- Verify the API endpoints are responding (`http://localhost:3000/api/health`)

## File Structure

```
├── components/          # Frontend components
│   ├── app.js          # Main application logic
│   ├── employee-form.js # Employee form component
│   ├── employee-table.js # Employee table component
│   └── page-header.js  # Page header component
├── database/           # Database files
│   └── schema.sql      # Database schema
├── pdf/               # PDF documentation
├── server.js          # Express server and API
├── migrate.js         # Database migration script
├── main.js           # Frontend entry point
├── index.html        # Main HTML file
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.