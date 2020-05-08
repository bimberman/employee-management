class PageHeader{
  constructor(headerElement){
    this.headerElement = headerElement;
  }
  updateAverage(newAverage){
    if(newAverage){
      this.headerElement.querySelector(".badge").textContent = Number(newAverage).toFixed(1);
    } else {
      this.headerElement.querySelector(".badge").textContent = "N/A";
    }
  }
}
