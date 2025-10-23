class EmployeeForm{
  constructor(formElement){
    this.formElement = formElement;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formElement.addEventListener("submit", this.handleSubmit);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  onSubmit(createEmployee){
    this.createEmployee = createEmployee;
  }
  onUpdate(updateEmployee){
    this.updateEmployee = updateEmployee;
  }
  handleSubmit(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    let name = formData.get("name");
    let lastName = formData.get("lastName");
    let position = formData.get("position");
    let department_name = formData.get("department_name");
    let salary = formData.get("salary");
    this.createEmployee(name, lastName, position, department_name, salary);
    event.target.reset();
  }
  editEmployeeForm(name, lastName, position, department_name, salary, id){
    this.formElement.removeEventListener("submit", this.handleSubmit);
    this.formElement.addEventListener("submit", this.handleUpdate);
    this.submitElement = this.formElement.querySelector("button[type='submit']");
    this.submitElement.textContent = "Update";

    let inputNameElement = this.formElement.querySelector("input[type='text'][name='name']");
    let inputLastNameElement = this.formElement.querySelector("input[type='text'][name='lastName']");
    let inputPositionElement = this.formElement.querySelector("input[type='text'][name='position']");
    let inputDepartmentElement = this.formElement.querySelector("input[type='text'][name='department_name']");
    let inputSalaryElement = this.formElement.querySelector("input[type='number'][name='salary']");

    inputNameElement.value = name;
    inputLastNameElement.value = lastName;
    inputPositionElement.value = position;
    inputDepartmentElement.value = department_name;
    inputSalaryElement.value = salary;
    this.id = id;
  }
  handleUpdate(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    let name = formData.get("name");
    let lastName = formData.get("lastName");
    let position = formData.get("position");
    let department_name = formData.get("department_name");
    let salary = formData.get("salary");
    this.updateEmployee(name, lastName, position, department_name, salary, this.id);
    event.target.reset();
    this.submitElement.textContent = "Add";
    this.formElement.removeEventListener("submit", this.handleUpdate);
    this.formElement.addEventListener("submit", this.handleSubmit);
  }
}
