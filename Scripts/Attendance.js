$(function () {
    let day_date = "";
    let attendance_time = "";
    
    $("#confirmattendance").submit(function (e) {
        e.preventDefault();
        let userName = $("#username").val();
        //inter system date
        let interDate = new Date();

        // exact date
        let exactDate = new Date();
        exactDate.setHours(8, 30, 0, 0);

        // late date
        let lateDate = new Date();
        lateDate.setHours(9, 0, 0, 0);

        let attend = 0;
        let late = 0;
        let absent = 0;
        let new_attendace_times = 0;
        let new_late_times = 0;
        let new_absent_times = 0;

        //check if user name exist or not
        fetch(`http://localhost:3000/employees?username=${userName}`)
            .then((data) => data.json())
            .then((data) => {
                if (data.length != 0) {
                    // get employee id
                    let employeeID = data[0].id;

                    


                    day_date = `${interDate.getFullYear()}-${interDate.getMonth() + 1}-${interDate.getDate()}`
                    attendance_time = interDate.toLocaleTimeString();
                    fetch(`http://localhost:3000/Attendance?employeeId=${employeeID}&daydate=${day_date}`)
                        .then((data) => data.json())
                        .then((data) => {
                            if (data.length == 0) {
                                let postBody = checkArrivalTime(employeeID, interDate, exactDate, lateDate, day_date, attendance_time);
                                fetch(`http://localhost:3000/Attendance`, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    method: "POST",
                                    body: JSON.stringify(postBody)
                                })//end of post fetch
                            } else {

                                let patchBody = {
                                    leave_time: new Date().toLocaleTimeString(),
                                }

                                fetch(`http://localhost:3000/Attendance/${data[0].id}`, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    method: "PATCH",
                                    body: JSON.stringify(patchBody)
                                })//end of patch fetch

                            }
                        })//end of fetch
                }
                else {
                    alert("no employee have this user name");
                }
            }).then(()=>{
                fetch(`http://localhost:3000/Employees?username=${userName}`)
                .then((data) => data.json())
                .then((data) => {
                    if (data.length != 0) {
                        let interDate = new Date();
                        attendance_time = interDate.toLocaleTimeString();
                        attendance_day = interDate.toDateString();
                        if (interDate <= exactDate) {
                            attend++;
                            new_attendace_times = (data[0].attendace_times) + attend;
                            fetch(`http://localhost:3000/Employees/${data[0].id}`, {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    "attendace_times": new_attendace_times,
                                }),
                                headers: { 'Content-type': 'application/json' }
                            })// end of fetch
                        } else if (interDate > exactDate && interDate <= lateDate) {
                            late++;
                            new_late_times = (data[0].late_times) + late;
                            fetch(`http://localhost:3000/Employees/${data[0].id}`, {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    "late_times": new_late_times,
                                }),
                                headers: { 'Content-type': 'application/json' }
                            })// end of fetch
                        } else {
                            absent++;
                            new_absent_times = (data[0].absence_times) + absent;
                            fetch(`http://localhost:3000/Employees/${data[0].id}`, {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    "late_times": new_late_times,
                                }),
                                headers: { 'Content-type': 'application/json' }
                            })// end of fetch
                        }
    
                    }
                })//end of fetch get
            })
        
        
    }); // end of submit form
}); //end of load page


////======================================== functions ============================/////////

function checkArrivalTime(employeeID, interDate, exactDate, lateDate, day_date, attendance_time) {
    let postBody = {}
    if (interDate <= exactDate) {
        postBody = {
            id: "",
            employeeId: employeeID,
            daydate: day_date,
            attendace_time: attendance_time,
            leave_time: 0,
            attendace_state: "Attend",
        }
    } else if (interDate > exactDate && interDate <= lateDate) {
        // 8.5 -----> 9
        let late_time = interDate.getMinutes() - exactDate.getMinutes();
        postBody = {
            id: "",
            employeeId: employeeID,
            daydate: day_date,
            attendace_time: attendance_time,
            leave_time: 0,
            attendace_state: "late",
            late_time: late_time + " min",
        }
    } else {
        postBody = {
            id: "",
            employeeId: employeeID,
            daydate: day_date,
            attendace_time: attendance_time,
            leave_time: 0,
            attendace_state: "absent",
        }

    }
    return postBody;
}

