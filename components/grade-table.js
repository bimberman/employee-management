class GradeTable{
  constructor(tableElement, noGradesElement){
    this.tableElement = tableElement;
    this.noGradesElement = noGradesElement;
  }
  updateGrades(grades){
    let tbody = this.tableElement.querySelector("tbody");

    while (tbody.firstChild) {
      tbody.removeChild(tbody.lastChild);
    }

    if(grades && grades.length){
      this.noGradesElement.classList.add("d-none")

      for (let dataIndex = 0; dataIndex < grades.length; dataIndex++) {
        tbody.append(this.renderGradeRow(grades[dataIndex], this.deleteGrade, this.editGrade));
      }
    } else {
      this.noGradesElement.classList.remove("d-none");
    }
  }
  onDeleteClick(deleteGrade){
    this.deleteGrade = deleteGrade;
  }
  onEditClick(editGrade) {
    this.editGrade = editGrade;
  }
  renderGradeRow(data, deleteGrade, editGrade){
    let tr = document.createElement("tr");
    let tdNames = document.createElement("td");
    let tdCourse = document.createElement("td");
    let tdGrade = document.createElement("td");
    let tdOperation = document.createElement("td");
    let updateButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    tdNames.classList.add("table-data");
    tdCourse.classList.add("table-data");
    tdGrade.classList.add("table-data");
    tdOperation.classList.add("table-data", "d-flex", "justify-content-around");

    updateButton.classList.add("btn", "btn-outline-info", "border", "border-0", "fas", "fa-edit");
    updateButton.addEventListener("click", function () { editGrade(data.name, data.course, data.grade, data.id) });

    deleteButton.classList.add("btn", "btn-outline-danger", "border", "border-0","fas", "fa-trash");
    deleteButton.addEventListener("click", function () { deleteGrade(data.id) });

    tdNames.textContent = data.name;
    tdCourse.textContent = data.course;
    tdGrade.textContent = data.grade;
    tdOperation.append(updateButton, deleteButton);

    tr.append(tdNames, tdCourse, tdGrade, tdOperation);
    return tr;
  }
}
