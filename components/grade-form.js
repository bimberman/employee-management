class GradeForm{
  constructor(formElement){
    this.formElement = formElement;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formElement.addEventListener("submit", this.handleSubmit);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  onSubmit(createGrade){
    this.createGrade = createGrade;
  }
  onUpdate(updateGrade){
    this.updateGrade = updateGrade;
  }
  handleSubmit(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    let name = formData.get("name");
    let course = formData.get("course");
    let grade = formData.get("grade");
    this.createGrade(name, course, grade);
    event.target.reset();
  }
  editGradeForm(name, course, grade, id){
    this.formElement.removeEventListener("submit", this.handleSubmit);
    this.formElement.addEventListener("submit", this.handleUpdate);
    this.submitElement = this.formElement.querySelector("button[type='submit']");
    this.submitElement.textContent = "Update";

    let inputNameElement = this.formElement.querySelector("input[type='text'][name='name']");
    let inputCourseElement = this.formElement.querySelector("input[type='text'][name='course']");
    let inputGradeElement = this.formElement.querySelector("input[type='text'][name='grade']");

    inputNameElement.value = name;
    inputCourseElement.value = course;
    inputGradeElement.value = grade;
    this.id = id;
  }
  handleUpdate(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    let name = formData.get("name");
    let course = formData.get("course");
    let grade = formData.get("grade");
    this.updateGrade(name, course, grade, this.id);
    event.target.reset();
    this.submitElement.textContent = "Add";
    this.formElement.removeEventListener("submit", this.handleUpdate);
    this.formElement.addEventListener("submit", this.handleSubmit);
  }
}
