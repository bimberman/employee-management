class App {
  constructor(gradeTable, pageHeader, gradeForm){
    this.apikey = "GFaE89M3";
    this.gradeTable = gradeTable;
    this.pageHeader = pageHeader;
    this.gradeForm = gradeForm;
    this.computeAvg = this.computeAvg.bind(this);
    this.handleGetGradesError = this.handleGetGradesError.bind(this);
    this.handleGetGradesSuccess = this.handleGetGradesSuccess.bind(this);
    this.createGrade = this.createGrade.bind(this);
    this.handleCreateGradeError = this.handleCreateGradeError.bind(this);
    this.handleCreateGradeSuccess = this.handleCreateGradeSuccess.bind(this);
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
        "X-Access-Token": this.apikey
      },
      success: this.handleGetGradesSuccess,
      error: this.handleGetGradesError
    })
  }
  start(){
    this.getGrades();
    this.gradeForm.onSubmit(this.createGrade);
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
  createGrade(name, course, grade) {
    $.ajax({
      url: "https://sgt.lfzprototypes.com/api/grades",
      method: "POST",
      headers: {
        "X-Access-Token": this.apikey
      },
      data: {
        "name": name,
        "course": course,
        "grade": grade
      },
      success: this.handleCreateGradeSuccess,
      error: this.handleCreateGradeError
    })
  }
  handleCreateGradeError(error){
    console.error(error);
  }
  handleCreateGradeSuccess(){
    this.getGrades();
  }
}
