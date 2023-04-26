// register form validation
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()


$(function () {
   $("#registerBtn").click(function(e){
    e.preventDefault();

    // get data from registeration form
    let userFirstName = $("#fname").val();
    let userLastName = $("#lname").val();
    let userAddress = $("#address").val();
    let userEmail = $("#email").val();
    let userAge = $("#age").val();
    let type = $(":checked").val() === "admin" ? "admin" : "employee";

    //Creating user object
    let dataOfUser = {
      id: "",
      firstname: userFirstName,
      lastname: userLastName,
      address: userAddress,
      email: userEmail,
      age: userAge,
      attendace_times: 0,
      late_times: 0,
      absence_times: 0,
      type: type,
    }

    // save data of user in local storage
    localStorage.setItem('employeedata', JSON.stringify(dataOfUser));


    // check if user existance in database then add user 
    fetch(`http://localhost:3000/employees?email=${userEmail}`)
      .then((data) => data.json())
      .then((data) => {
        if (data.length != 0)
          alert("This email is already taken by another employee !");
        else {
          addNewUser(dataOfUser);
        }
      })//end of fetch


  });// end of form registeration
  $("#login").click(function () {
    document.location.replace("../Pages/login_page.html");
  })// end of form login
});//end of load page


//============================================  functions  =======================================================//

// add new usre to pendding list
async function addNewUser(dataOfUser) {
  await fetch('http://localhost:3000/penddingEmployees', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataOfUser)
  });
}

