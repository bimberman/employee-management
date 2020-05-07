// Pushed and merged to master by mistake :(

var gradeTableElement = document.getElementById("grades-table");
var headerElement = document.getElementById("header");

var gradeTable = new GradeTable(gradeTableElement);
var pageHeader = new PageHeader(headerElement);
var app = new App(gradeTable, pageHeader);
app.start();
