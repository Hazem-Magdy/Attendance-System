$(function () {
    // display first name and last name when user inter
    $("#adminname").text(" " + localStorage.getItem("admin_firstname") + " " + localStorage.getItem('admin_lastname') + " ");
    
    //late report
    $.ajax({
        url: "http://localhost:3000/employees",
        method: "get",
        dataType: "json",
        success: function(data) {
            let createdrow = "";
            let count = 1;
            for (var i = 0; i < data.length; i++) {
                createdrow = $('<tr><th scope="row">' + count + '</th><td>' + data[i].id + '</td><td>' + data[i].firstname + '</td><td>' + data[i].lastname + '</td><td>' + data[i].username + '</td><td>' + data[i].late_times + '</td></tr>');
                $("table:eq(0) > tbody").append(createdrow);
                count++;
            }
            $(function() {
                $("#mytable").dataTable();
                });
        },
        error: function(error) {
            console.log("error");
        }
    });
    
    
});//end of load

// user logout
$("#logout").click(logout);

// user logout
function logout() {
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_firstname");
    localStorage.removeItem("admin_lastname");
    window.location.replace("../Pages/login_page.html");
}
