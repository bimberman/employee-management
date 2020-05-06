$.ajax({
  url: "https://sgt.lfzprototypes.com/api/users",
  Method: "POST",
  Data: {
    firstName: "Ben",
    lastName: "Imberman",
    cohort: "c04.20" // cohort must follow the following format: cMM.YY
  },
  success: function(data){
    if (console && console.log) {
      console.log(data);
    }
  },
  error: function (err) {
    if (console && console.log) {
      console.log(err);
    }
  }
});

// response:
// apiKey: "GFaE89M3"
// message: "User for Ben Imberman created. Write down your API Key, you will need it for the rest of this project."
