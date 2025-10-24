// Pushed and merged to master by mistake :(

var employeeTableElement = document.getElementById('employees-table');
var headerElement = document.getElementById('header');
var formElement = document.getElementById('form');
var pElement = document.getElementById('hidden-pEle');

var employeeTable = new EmployeeTable(employeeTableElement, pElement);
var pageHeader = new PageHeader(headerElement);
var employeeForm = new EmployeeForm(formElement);
var app = new App(employeeTable, pageHeader, employeeForm);
app.start();
