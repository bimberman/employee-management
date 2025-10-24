class PageHeader {
  constructor(headerElement) {
    this.headerElement = headerElement;
  }
  updateEmployeeCount(employeeCount) {
    this.headerElement.querySelector('.badge').textContent = employeeCount;
  }
}
