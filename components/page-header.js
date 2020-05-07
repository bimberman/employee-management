class PageHeader{
  constructor(headerElement){
    this.headerElement = headerElement;
  }
  updateAverage(newAverage){
    if(newAverage){
      this.headerElement.querySelector(".badge").textContent = newAverage;
    } else {
      this.headerElement.querySelector(".badge").textContent = "N/A";
    }
  }
}
