class App {
  constructor(gradeTable, pageHeader, gradeForm){
    this.baseUrl = "https://sgt.lfzprototypes.com/";
    this.path = "api/grades/";
    this.apikey = "GFaE89M3";
    this.gradeTable = gradeTable;
    this.pageHeader = pageHeader;
    this.gradeForm = gradeForm;
    this.grades = [];

    this.computeAvg = this.computeAvg.bind(this);
    this.editGrade = this.editGrade.bind(this);

    this.getGrades = this.getGrades.bind(this);
    this.handleGetGradesError = this.handleGetGradesError.bind(this);
    this.handleGetGradesSuccess = this.handleGetGradesSuccess.bind(this);

    this.createGrade = this.createGrade.bind(this);
    this.handleCreateGradeError = this.handleCreateGradeError.bind(this);
    this.handleCreateGradeSuccess = this.handleCreateGradeSuccess.bind(this);

    this.deleteGrade = this.deleteGrade.bind(this);
    this.handleDeleteGradeError = this.handleDeleteGradeError.bind(this);
    this.handleDeleteGradeSuccess = this.handleDeleteGradeSuccess.bind(this);

    this.updateGrade = this.updateGrade.bind(this);
    this.handleUpdateGradeError = this.handleUpdateGradeError.bind(this);
    this.handleUpdateGradeSuccess = this.handleUpdateGradeSuccess.bind(this);
  }

  start() {
    this.getGrades();
    this.gradeForm.onSubmit(this.createGrade);
    this.gradeForm.onUpdate(this.updateGrade);
    this.gradeTable.onDeleteClick(this.deleteGrade);
    this.gradeTable.onEditClick(this.editGrade);
  }
  computeAvg(gradesObj) {
    let grades = 0;
    let i = 0
    if (gradesObj) {
      while (gradesObj[i]) {
        grades += gradesObj[i].grade;
        i++;
      }
    }
    return grades / i;
  }
  editGrade(name, course, grade, id){
    this.gradeForm.editGradeForm(name, course, grade, id);
  }

  getGrades() {
    $.ajax({
      url: this.baseUrl + this.path,
      method: "GET",
      headers: {
        "X-Access-Token": this.apikey
      },
      success: this.handleGetGradesSuccess,
      error: this.handleGetGradesError
    })
  }
  handleGetGradesError (error){
    console.error(error);
  }
  handleGetGradesSuccess (grades){
    this.gradeTable.updateGrades(grades);
    this.pageHeader.updateAverage(this.computeAvg(grades));
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

  updateGrade(name, course, grade, id) {
    $.ajax({
      url: this.baseUrl + this.path + id,
      method: "PATCH",
      headers: {
        "X-Access-Token": this.apikey
      },
      data: {
        "name": name,
        "course": course,
        "grade": grade
      },
      success: this.handleUpdateGradeSuccess,
      error: this.handleUpdateGradeError
    })
  }
  handleUpdateGradeError(error) {
    console.error(error);
  }
  handleUpdateGradeSuccess() {
    this.getGrades();
  }
}
