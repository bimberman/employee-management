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

    let tr = [];
    let tdNames = [];
    let tdCourse = [];
    let tdGrade = [];

    for (let dataIndex = 0; dataIndex < grades.length; dataIndex++) {
      tr.push(document.createElement("tr"));
      tdCourse.push(document.createElement("td"));
      tdNames.push(document.createElement("td"));
      tdGrade.push(document.createElement("td"));

      tdNames[(dataIndex)].textContent = grades[dataIndex].name;
      tdCourse[(dataIndex)].textContent = grades[dataIndex].course;
      tdGrade[dataIndex].textContent = grades[dataIndex].grade;

      tr[dataIndex].append(tdNames[dataIndex], tdCourse[dataIndex], tdGrade[dataIndex]);

      tbody.append(tr[dataIndex]);
    }
  }
}
