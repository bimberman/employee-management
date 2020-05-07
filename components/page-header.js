class PageHeader{
  constructor(headerElement){
    this.headerElement = headerElement;
  }
  updateAverage(newAverage){
    console.log(newAverage);
    this.headerElement.querySelector(".badge").textContent = newAverage;
  }
}
