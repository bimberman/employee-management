class GradeTable{
  constructor(tableElement){
    this.tableElement = tableElement;
  }
  updateGrades(grades){
    console.log(grades);
    let tbody = this.tableElement.querySelector("tbody");
    while (tbody.firstChild){
      tbody.removeChild(tbody.lastChild);
    }

    for (let dataIndex = 0; dataIndex < grades.length; dataIndex++) {
      let tr = document.createElement("tr");
      let tdNames = document.createElement("td");
      let tdCourse = document.createElement("td");
      let tdGrade = document.createElement("td");

      tdNames.classList.add("table-data");
      tdCourse.classList.add("table-data");
      tdGrade.classList.add("table-data");

      tdNames.textContent = grades[dataIndex].name;
      tdCourse.textContent = grades[dataIndex].course;
      tdGrade.textContent = grades[dataIndex].grade;

      tr.append(tdNames, tdCourse, tdGrade);

      tbody.append(tr);
    }
  }
}
