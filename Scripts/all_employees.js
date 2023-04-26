$(function () {
    // display employee first name and last name when he inter
    $("#adminname").text(" " + localStorage.getItem("admin_firstname") + " " + localStorage.getItem('admin_lastname') + " ");

    // dasplay all employees data
    $.ajax({
        url: "../db.json",
        method: "get",
        dataType: "json",
        success: function (data) {
            let createdrow = "";
            let count = 1;
            for (var i = 0; i < data.employees.length; i++) {
                createdrow = $('<tr><th scope="row">' + count + '</th><td>' + data.employees[i].id + '</td><td>' + data.employees[i].firstname + '</td><td>' + data.employees[i].lastname + '</td><td>' + data.employees[i].address + '</td><td>' + data.employees[i].email + '</td><td>' + data.employees[i].age + '</td><td>' + data.employees[i].username + '</td><td>' + data.employees[i].password + '</td></tr>');
                $("table:eq(0) > tbody").append(createdrow);
                count++;
            }
            $(function () {
                $("#mytable").dataTable();
            });
        },
        error: function (error) {
            console.log("error");
        }
    });
    
});

// user logout
$("#logout").click(logout);

// user logout
function logout() {
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_firstname");
    localStorage.removeItem("admin_lastname");
    window.location.replace("../Pages/login_page.html");
}


