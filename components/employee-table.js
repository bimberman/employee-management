class EmployeeTable {
  constructor(tableElement, noEmployeesElement) {
    this.tableElement = tableElement;
    this.noEmployeesElement = noEmployeesElement;
  }
  updateEmployees(employees) {
    let tbody = this.tableElement.querySelector('tbody');

    while (tbody.firstChild) {
      tbody.removeChild(tbody.lastChild);
    }

    if (employees && employees.length) {
      this.noEmployeesElement.classList.add('d-none');

      for (let dataIndex = 0; dataIndex < employees.length; dataIndex++) {
        tbody.append(
          this.renderEmployeeRow(
            employees[dataIndex],
            this.deleteEmployee,
            this.editEmployee
          )
        );
      }
    } else {
      this.noEmployeesElement.classList.remove('d-none');
    }
  }
  onDeleteClick(deleteEmployee) {
    this.deleteEmployee = deleteEmployee;
  }
  onEditClick(editEmployee) {
    this.editEmployee = editEmployee;
  }
  renderEmployeeRow(data, deleteEmployee, editEmployee) {
    let tr = document.createElement('tr');
    let tdName = document.createElement('td');
    let tdPosition = document.createElement('td');
    let tdDepartment = document.createElement('td');
    let tdSalary = document.createElement('td');
    let tdOperation = document.createElement('td');
    let updateButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    tdName.classList.add('table-data');
    tdPosition.classList.add('table-data');
    tdDepartment.classList.add('table-data');
    tdSalary.classList.add('table-data');
    tdOperation.classList.add('table-data', 'd-flex', 'justify-content-around');

    updateButton.classList.add(
      'btn',
      'btn-outline-info',
      'border',
      'border-0',
      'fas',
      'fa-edit'
    );
    updateButton.addEventListener('click', function () {
      editEmployee(
        data.name,
        data.lastName,
        data.position,
        data.department_name,
        data.salary,
        data.id
      );
    });

    deleteButton.classList.add(
      'btn',
      'btn-outline-danger',
      'border',
      'border-0',
      'fas',
      'fa-trash'
    );
    deleteButton.addEventListener('click', function () {
      deleteEmployee(data.id);
    });

    tdName.textContent = `${data.name} ${data.lastName}`;
    tdPosition.textContent = data.position;
    tdDepartment.textContent = data.department_name;
    tdSalary.textContent = `$${data.salary.toLocaleString()}`;
    tdOperation.append(updateButton, deleteButton);

    tr.append(tdName, tdPosition, tdDepartment, tdSalary, tdOperation);
    return tr;
  }
}
