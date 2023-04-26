$(function () {
    // display admin first name and last name when he inter
    $("#adminname").text(" " + localStorage.getItem("admin_firstname") + " " + localStorage.getItem('admin_lastname') + " ");
    
    // display pendding employees and confirm states 
    $.ajax({
        url: "../db.json",
        method: "get",
        dataType: "json",
        success: function (data) {
            let createdrow = "";
            let count = 1;
            for (var i = 0; i < data.penddingEmployees.length; i++) {
                createdrow = $('<tr><th scope="row">' + count + '</th><td>' + data.penddingEmployees[i].id + '</td><td>' + data.penddingEmployees[i].firstname + '</td><td>' + data.penddingEmployees[i].lastname + '</td><td>' + data.penddingEmployees[i].address + '</td><td>' + data.penddingEmployees[i].email + '</td><td>' + data.penddingEmployees[i].age + '</td><td>' + '<i class="fa-solid fa-check checkRight" ></i>' + '</td><td>' + '<i class="fa-sharp fa-solid fa-xmark checkWrong"></i>' + '</td></tr>');
                $("table:eq(0) > tbody").append(createdrow);
                count++;
            }
            $(function () {
                $("#mytable").dataTable();
            });

            $(".checkRight").on("click", function (e) {
                var sure = confirm("are you sure to confirm this user ?");
                if (sure == true) {
                    sendToEmp(e);
                } else {
                    alert("ok be careful !");
                }
            });
            $(".checkWrong").on("click", function (e) {
                let penddingEmployeeID = e.target.parentElement.parentElement.children[1].innerHTML;
                var sure = confirm("are you sure to block this user ?");
                if (sure == true) {
                    fetch(`http://localhost:3000/penddingEmployees/${penddingEmployeeID}`, {
                        method: 'DELETE',
                    })

                } else {
                    alert("ok be careful !");
                }
            });
        },
        error: function (error) {
            console.log("error");
        }
    });
});

//=========================================   functions   =========================================================//

// Generate Random UserName
function generateRondomUsername(userFirstName, currentDate) {
    return userFirstName + currentDate.getDay() + currentDate.getHours() + currentDate.getSeconds();
}

// Generate Rondom Password
function generateRondomPassword(userFirstName, userLastName, currentDate) {
    return userFirstName.substring(0, 2) + userLastName.substring(0, 2) + currentDate.getFullYear() + currentDate.getHours() + currentDate.getSeconds() + currentDate.getDay();
}

//Send MAil
function sendMail(userFirstName, randomUserName, randomPassword, userEmail) {
    const serviceID = "service_s58zm27";
    const templateID = "template_jn8vmmw";
    var params = {
        from_name: "ITI Admin",
        firstname: userFirstName,
        username: randomUserName,
        password: randomPassword,
        email: userEmail,
    }
    return emailjs.send(serviceID, templateID, params)
}
// user logout        
$("#logout").click(logout);

// user logout
function logout() {
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_firstname");
    localStorage.removeItem("admin_lastname");
    window.location.replace("../Pages/login_page.html");
}


async function sendToEmp(e) {
    let penddingEmployeeID = e.target.parentElement.parentElement.children[1].innerHTML;
    let userData = await fetch(`http://localhost:3000/penddingEmployees?id=${penddingEmployeeID}`);
    let userDataObject = await userData.json();


    let userFirstName = userDataObject[0].firstname;
    let userLastName = userDataObject[0].lastname;
    let userEmail = userDataObject[0].email;

    //Generating unique username and password for the employee
    let currentDate = new Date();
    let randomPassword = generateRondomPassword(userFirstName, userLastName, currentDate);
    let randomUserName = generateRondomUsername(userFirstName, currentDate);


    // add username  and passo
    userDataObject[0].username = randomUserName;
    userDataObject[0].password = randomPassword;

    // delete user from pendding employess and post him into employees and send email to him
    sendMail(userFirstName, randomUserName, randomPassword, userEmail).then(() => {
        fetch(`http://localhost:3000/penddingEmployees/${userDataObject[0].id}`, { method: 'DELETE' })
            .then(() => {
                userDataObject[0].id = "";
                fetch(`http://localhost:3000/employees`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userDataObject[0]),
                })// end of fetch
            })
    })//end of fetch
}

