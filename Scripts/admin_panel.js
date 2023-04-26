$(function() {
    // display employee first name and last name when he inter
    $("#adminname").text(" " + localStorage.getItem("admin_firstname") + " " + localStorage.getItem('admin_lastname') + " ");
    $("#wellcomeadmin").text(" " + localStorage.getItem("admin_firstname") + " " + localStorage.getItem('admin_lastname') + " ");
});

// user logout
$("#logout").click(logout);

// user logout
function logout () {
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_firstname");
    localStorage.removeItem("admin_lastname");
    window.location.replace("../Pages/login_page.html");
} 
