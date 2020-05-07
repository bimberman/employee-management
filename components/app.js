class App {
  constructor(gradeTable, pageHeader, gradeForm){
    this.baseUrl = "https://sgt.lfzprototypes.com/";
    this.path = "api/grades/";
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
    this.deleteGrade = this.deleteGrade.bind(this);
    this.handleDeleteGradeError = this.handleDeleteGradeError.bind(this);
    this.handleDeleteGradeSuccess = this.handleDeleteGradeSuccess.bind(this);
  }
  handleGetGradesError (error){
    console.error(error);
  }
  handleGetGradesSuccess (grades){
    this.gradeTable.updateGrades(grades);
    this.pageHeader.updateAverage(this.computeAvg(grades));
  }
  getGrades(){
    $.ajax({
      url: this.baseUrl+this.path,
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
    this.gradeTable.onDeleteClick(this.deleteGrade);
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
      url: this.baseUrl + this.path,
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
  deleteGrade(id){
    $.ajax({
      url: this.baseUrl + this.path + id,
      method: "DELETE",
      headers: {
        "X-Access-Token": this.apikey
      },
      success: this.handleDeleteGradeSuccess,
      error: this.handleDeleteGradeError
    })
  }
  handleDeleteGradeError(error){
    console.error(error);
  }
  handleDeleteGradeSuccess(){
    this.getGrades();
  }
}
