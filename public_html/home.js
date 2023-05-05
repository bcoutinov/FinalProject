/*  Author:     Carlton Louie, Brenda Coutino, Kianny Calvo
    Class:      CSC 337
    File:       client.js
    File:       home.js
    Assignment: Final Project
    This file is the JS for the client home of the service desk
    */

const url = "http://127.0.0.1"

function createTicket() {
    let d = new Date();
    let t = document.getElementById('title').value;
    let desc = document.getElementById('desc').value;
    let priority = document.getElementById('priority').value;
    // these two var and for loop get the user selected radio value
    var requestType = document.getElementsByName('type');
    var rt;
    for(var i = 0; i < requestType.length; i++) {
        if(requestType[i].checked) {
            rt = requestType[i].value;
            break;
        }}
    let s = "Open"
    // url and data are for the fetch request
    let url = '/post/newTicket/';
    let data = { date: d, title: t, desc: desc, 
        priority: priority, type: rt, status: s};
    // request
    let p = fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"} // adjust language w/ server
    });
    // should call viewTicket()
    p.then(() => {
      console.log('Ticket Created');
      alert("Ticket Created!");
      getTickets();
    });
    p.catch(() => { 
      alert('something went wrong');
    });
}

// Takes tickets and displays them on the webpage
function getTickets(){
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
      alert('Error');
      return false;
  }
  httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
              showTickets(httpRequest.responseText);
          } 
          else { alert('Error fetching Items'); }
      }
  }

  httpRequest.open('GET', url + "/get/userTickets");
  httpRequest.send();
}

var taskBody = document.getElementById("client-ticket-table");

// Takes items and displays them on the webpage
function showTickets(responseText){
  let tasks = JSON.parse(responseText);
  let taskStrings = [];

  for (let i in tasks){
      let tFunc = "openTicket('"+tasks[i]._id+"');";
      let taskString = '<tr>';
      let taskId = '<td onclick='+tFunc+'>' + tasks[i]._id.slice(19, 24) + '</td>';
      let time = '<td>' + tasks[i].date + '</td>';
      let priority = '<td>' + tasks[i].priority + '</td>';
      let state = '<td>' + tasks[i].status + '</td>';
      let title = '<td>' + tasks[i].title + '</td>';
      taskString = taskString + taskId + title + time + priority + state + "</tr>";
      taskStrings.push(taskString);
  }

  let htmlText =  taskStrings.join("");

  taskBody.innerHTML = htmlText;
}

// Opens the ticket view page
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
              window.location.href = '/home';
          }
      })
      .catch((error) => {
          console.log(error);
      });
}

getTickets()
