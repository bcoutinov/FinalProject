/*	Author: 	Carlton Louie, Brenda Coutino, Kianny Calvo
	Class:  	CSC 337
	File:		admin.js
	Assignment:	Final Project
	This file is the JS for the admin-side of the service desk
*/

const url = "http://127.0.0.1"

// Takes tickets and displays them on the webpage
function showtickets(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Error');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
                showTickets(httpRequest.responseText);
            } 
            else { alert('Error fetching Items'); }
        }
    }

    httpRequest.open('GET', url + "/get/adminTickets");
    httpRequest.send();
}

var taskBody = document.getElementById("taskBody");

// Takes items and displays them on the webpage
function showTickets(responseText){
    let tasks = JSON.parse(responseText);
    let taskStrings = [];

    for (let i in tasks){
        console.log(tasks[i].title);

        let tFunc = "openTicket('"+tasks[i]._id+"');";
        let taskString = '<tr>';
        let taskId = '<td onclick='+tFunc+'>' + tasks[i]._id.slice(18, 23) + '</td>';
        let time = '<td>' + tasks[i].date + '</td>';
        let priority = '<td>' + tasks[i].priority + '</td>';
        let state = '<td>' + tasks[i].status + '</td>';
        let title = '<td>' + tasks[i].title + '</td>';
        let type = '<td>' + tasks[i].type + '</td>';
        let user = '<td>' + tasks[i].user + '</td>';
        taskString = taskString + taskId + time + priority + state + title + type + user + "</tr>";
        taskStrings.push(taskString);
    }

    let htmlText =  taskStrings.join("");

    taskBody.innerHTML = htmlText;
}


//
function openTicket(id){
    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ticketId : id,
         }),
    };

    fetch(url + '/post/ticketView', requestOptions)
        .then((response) => {
            if (response.status == 200){
                window.location.href = '/ticketView';
            }
            else{
                window.location.href = '/home_admin';
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

showtickets()