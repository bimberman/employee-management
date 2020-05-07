// Pushed and merged to master by mistake :(

var gradeTableElement = document.getElementById("grades-table");
var headerElement = document.getElementById("header");
var formElement = document.getElementById("form");

var gradeTable = new GradeTable(gradeTableElement);
var pageHeader = new PageHeader(headerElement);
var gradeForm = new GradeForm(formElement);
var app = new App(gradeTable, pageHeader, gradeForm);
app.start();
