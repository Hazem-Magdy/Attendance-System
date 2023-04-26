$(function () {
    let employee_username = localStorage.getItem("employee_username");
    let userName = $("#username");
    let firstName = $("#firstname");
    let lastName = $("#lastname");
    let userEmail = $("#email");
    let userAddress = $("#address");
    let userAge = $("#age")
    let attendanceTime = $("#attime");
    let leaveTime = $("#leavetime");
    let todayDate = $("#todaydate");
    let startDate = "";
    let endDate = "";
    let attendanceStatue = $("#status")
    let attendanceTimes = $("#attimes");
    let lateTimes = $("#lates");
    let absencets = $("#abscs");


    fetch(`http://localhost:3000/employees?username=${employee_username}`)
        .then((data) => data.json())
        .then((data) => {
            if (data.length != 0) {
                // employee information
                userName.text(data[0].username);
                firstName.text(data[0].firstname);
                lastName.text(data[0].lastname);
                userEmail.text(data[0].email);
                userAddress.text(data[0].address);
                userAge.text(data[0].age);

                //get employee id
                let employeeId = data[0].id;

                //daily report 
                $("#day").change(function () {
                    let dayDate = new Date($("#day").val());
                    var year = dayDate.getFullYear();
                    let month = dayDate.getMonth() + 1;
                    let day = dayDate.getDate();
                    let dDate = [year, month, day].join('-');
                    fetch(`http://localhost:3000/Attendance?employeeId=${employeeId}&daydate=${dDate}`)
                        .then((data) => data.json())
                        .then((data) => {
                            if (data.length != 0) {
                                todayDate.val(data[0].daydate)
                                attendanceTime.val(data[0].attendace_time);
                                leaveTime.val(data[0].leave_time);
                                attendanceStatue.val(data[0].attendace_state)
                            }else{
                                todayDate.val("didnt found")
                                attendanceTime.val("--");
                                leaveTime.val("--");
                                attendanceStatue.val("didnt come to iti this day")
                            }
                        })//end of fetch
                })//end of day calender change

                //monthly report
                $("#fromdate").change(function () {
                    // start date
                    let date = new Date($("#fromdate").val());
                    var year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    startDate = [year, month, day].join('-');

                    $("#todate").change(function () {
                        // end date
                        let toDate = new Date($("#todate").val());
                        var year = toDate.getFullYear();
                        let month = toDate.getMonth() + 1;
                        let day = toDate.getDate();
                        endDate = [year, month, day].join('-');
                        console.log(endDate)
                        console.log(startDate)
                        if (startDate != "" && endDate != "") {
                            fetch(`http://localhost:3000/Attendance?_expand=employee&daydate_gte=${startDate}&daydate_lte=${endDate}`)
                                .then((data) => data.json())
                                .then((data) => {
                                    // data => array of attendance [{},{},{}]
                                    if (data.length != 0) {
                                        fetch(`http://localhost:3000/Attendance?employeeId=${employeeId}`)
                                            .then((data) => data.json())
                                            .then((data) => {
                                                if (data.length != 0){
                                                    console.log(data)
                                                    let attend =0;
                                                    let late=0;
                                                    let absent=0
                                                    data.forEach(element => {
                                                        if(element.attendace_state == "Attend"){
                                                            attend++;
                                                        }else if(element.attendace_state == "late"){
                                                            late++;
                                                        }else{
                                                            absent++;
                                                        }
                                                        attendanceTimes.val(attend);
                                                        lateTimes.val(late);
                                                        absencets.val(absent)

                                                    });
                                                }
                                                    
                                                else {
                                                    alert("employee didnt attend any dayes yet")
                                                }
                                            })//end of fetch
                                    }
                                    else {
                                        alert("no array of attendance employees in this range")
                                    }
                                })//end of fetch
                        }
                    })

                })
            }
            else {
                alert("employee not exist");
            }
        })//end of fetch


















})//end of load page





