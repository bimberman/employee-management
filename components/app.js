class App {
  constructor(employeeTable, pageHeader, employeeForm){
    this.employeeTable = employeeTable;
    this.pageHeader = pageHeader;
    this.employeeForm = employeeForm;
    this.employees = [];
    this.nextId = 1000; // Starting ID for new employees (using higher number to avoid conflicts)

    this.computeEmployeeCount = this.computeEmployeeCount.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
    this.getEmployees = this.getEmployees.bind(this);
    this.createEmployee = this.createEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
  }

  start() {
    this.getEmployees();
    this.employeeForm.onSubmit(this.createEmployee);
    this.employeeForm.onUpdate(this.updateEmployee);
    this.employeeTable.onDeleteClick(this.deleteEmployee);
    this.employeeTable.onEditClick(this.editEmployee);
  }
  computeEmployeeCount(employeesObj) {
    return employeesObj ? employeesObj.length : 0;
  }
  editEmployee(name, lastName, position, department_name, salary, id){
    this.employeeForm.editEmployeeForm(name, lastName, position, department_name, salary, id);
  }
  addAllEmployees(employees){
    this.employees = employees;
  }
  addAEmployee(employee){
    this.employees.push(employee);
  }
  deleteAEmployee(id){
    if(this.employees){
      for (let i = 0; i < this.employees.length; i++) {
        if(this.employees[i].id == id){
          this.employees.splice(i,1);
        }
      }
    }
  }
  updateAEmployee(name, lastName, position, department_name, salary, id){
    if (this.employees) {
      for (let i = 0; i < this.employees.length; i++) {
        if (this.employees[i].id == id) {
          this.employees[i].name = name;
          this.employees[i].lastName = lastName;
          this.employees[i].position = position;
          this.employees[i].department_name = department_name;
          this.employees[i].salary = salary;
        }
      }
    }
  }

  getEmployees() {
    // Load employees from PostgreSQL database via API
    fetch('/api/employees')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(employees => {
        this.addAllEmployees(employees);
        this.employeeTable.updateEmployees(employees);
        this.pageHeader.updateEmployeeCount(this.computeEmployeeCount(employees));
      })
      .catch(error => {
        console.error('Error loading employees:', error);
        // Fallback to empty array if API can't be reached
        this.addAllEmployees([]);
        this.employeeTable.updateEmployees([]);
        this.pageHeader.updateEmployeeCount(0);
      });
  }

  createEmployee(name, lastName, position, department_name, salary) {
    // Create new employee via API
    fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        lastName: lastName,
        position: position,
        department_name: department_name,
        salary: parseInt(salary)
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(newEmployee => {
      this.addAEmployee(newEmployee);
      this.employeeTable.updateEmployees(this.employees);
      this.pageHeader.updateEmployeeCount(this.computeEmployeeCount(this.employees));
    })
    .catch(error => {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. Please try again.');
    });
  }

  deleteEmployee(id){
    // Delete employee via API
    fetch(`/api/employees/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      this.deleteAEmployee(id);
      this.employeeTable.updateEmployees(this.employees);
      this.pageHeader.updateEmployeeCount(this.computeEmployeeCount(this.employees));
    })
    .catch(error => {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee. Please try again.');
    });
  }

  updateEmployee(name, lastName, position, department_name, salary, id) {
    // Update employee via API
    fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        lastName: lastName,
        position: position,
        department_name: department_name,
        salary: parseInt(salary)
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedEmployee => {
      this.updateAEmployee(name, lastName, position, department_name, salary, id);
      this.employeeTable.updateEmployees(this.employees);
      this.pageHeader.updateEmployeeCount(this.computeEmployeeCount(this.employees));
    })
    .catch(error => {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    });
  }
}
