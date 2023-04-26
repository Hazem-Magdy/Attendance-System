$(function () {
    $(":button:eq(1)").click(function (e) {
        e.preventDefault();
        let userName = $(":text:first").val();
        let password = $(":input:password").val();
        loginToSystem(userName,password);
    }) // end of click on login 

    $(":button:eq(0)").click(function(e){
        e.preventDefault();
        window.location.href="../Pages/registration_page.html"
    })// end of click on register 
})// load of page

//============================================  functions  =======================================================//

function loginToSystem(userName,password){
    fetch(`http://localhost:3000/Employees?username=${userName}&password=${password}`)
    .then((data)=>data.json())
    .then((data)=>{
    if (data.length != 0) {
            // Employee
        if(data[0].type == "employee"){
            window.location.href="../Pages/empolyee_profile.html"

            // store  employee info in local storage
            localStorage.setItem("employee_username", data[0].username);
            localStorage.setItem("employee_firstname", data[0].firstname);
            localStorage.setItem("employee_lastname", data[0].lastname);
            // admin
        }else if(data[0].type == "admin"){
            window.location.replace("../Pages/admin_panel.html")

            // store  admin info in local storage
            localStorage.setItem("admin_username", data[0].username);
            localStorage.setItem("admin_firstname", data[0].firstname);
            localStorage.setItem("admin_lastname", data[0].lastname);

        }else{
            // Security man
            window.location.href="../Pages/attendance_page.html"
            // store  security username in local storage
            localStorage.setItem("security_username", data[0].username);
        }
    } 
    else{
        alert("you must register first"); 
    }
    
   
})

}