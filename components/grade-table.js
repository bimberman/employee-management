class GradeTable{
  constructor(tableElement, noGradesElement){
    this.tableElement = tableElement;
    this.noGradesElement = noGradesElement;
  }
  updateGrades(grades){
    let tbody = this.tableElement.querySelector("tbody");

    if(grades){
      this.noGradesElement.classList.add(".d-none")
      console.log(grades);
      while (tbody.firstChild){
        tbody.removeChild(tbody.lastChild);
      }

      for (let dataIndex = 0; dataIndex < grades.length; dataIndex++) {
        tbody.append(this.renderGradeRow(grades[dataIndex], this.deleteGrade));
      }
    } else {
      this.noGradesElement.classList.remove(".d-none")
    }
  }
  onDeleteClick(deleteGrade){
    this.deleteGrade = deleteGrade;
  }
  renderGradeRow(data, deleteGrade){
    let tr = document.createElement("tr");
    let tdNames = document.createElement("td");
    let tdCourse = document.createElement("td");
    let tdGrade = document.createElement("td");
    let tdDelete = document.createElement("td");
    let deleteButton = document.createElement("button");

    tdNames.classList.add("table-data");
    tdCourse.classList.add("table-data");
    tdGrade.classList.add("table-data");
    tdDelete.classList.add("table-data", "justify-content-center");
    deleteButton.classList.add("btn", "btn-danger");

    deleteButton.addEventListener("click", deleteGrade(data.id));

    tdNames.textContent = data.name;
    tdCourse.textContent = data.course;
    tdGrade.textContent = data.grade;
    deleteButton.textContent = "DELETE";

    tdDelete.appendChild(deleteButton);
    tr.append(tdNames, tdCourse, tdGrade, tdDelete);
    return tr;
  }
}
