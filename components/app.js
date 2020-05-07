class App {
  constructor(gradeTable, pageHeader){
    this.gradeTable = gradeTable;
    this.pageHeader = pageHeader;
    this.computeAvg = this.computeAvg.bind(this);
    this.handleGetGradesError = this.handleGetGradesError.bind(this);
    this.handleGetGradesSuccess = this.handleGetGradesSuccess.bind(this);
  }
  handleGetGradesError (error){
    console.error(error);
  }
  handleGetGradesSuccess (grades){
    console.log(grades);
    this.gradeTable.updateGrades(grades);
    this.pageHeader.updateAverage(this.computeAvg(grades));
  }
  getGrades(){
    $.ajax({
      url: "https://sgt.lfzprototypes.com/api/grades",
      method: "GET",
      headers: {
        "X-Access-Token": "GFaE89M3"
      },
      success: this.handleGetGradesSuccess,
      error: this.handleGetGradesError
    })
  }
  start(){
    this.getGrades();
  }
  computeAvg(gradesObj){
    let grades = 0;
    let i = 0
    if(gradesObj){
      while (gradesObj[i]){
        grades += gradesObj[i].grade;
        i++;
      }
    }
    return grades/i;
  }
}
