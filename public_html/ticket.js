/*	Author: 	Carlton Louie, Kianny Calvo, Brenda Coutino
	Class:		CSC 337
	File:		ticket.js
	Assignment:	Final Project
	This file is the javascript for the ticket page functionality.
*/

const url = "http://127.0.0.1"

// openForm allows the user to open the chat area

function openForm () {
    document.getElementById("chat-form").style.display = "block";
}

// closeForm allows the user to hide the chat area

function closeForm () {
    document.getElementById("chat-form").style.display = "none";
}

function sendMsg(){
  msg = document.getElementById("user-msg").value;
  let requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        msg : msg,
     }),
  };

  fetch(url + '/post/msg', requestOptions)
      .then((response) => {
          if (response.status == 200){
              showTicket();
          }
      })
      .catch((error) => {
          console.log(error);
      });
}

// openCollapsible allows the user to open the status area

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// displays ticket data on page

function showTicket() {
  let url = '/get/ticket/';
	let p = fetch(url);
	let ps = p.then( (response) => {
		if (response.status === 200) {
      			document.getElementsByClassName("collapsible")[0].style.display = "none";
    		}
    return response.json()   
	}).then((object) => { 
    document.getElementsByTagName("h1")[0].innerHTML = "Ticket Id: " + object._id.slice(19, 24);
    document.getElementById("title").innerText = object.title;
    document.getElementById("client").innerText = object.user;
    document.getElementById("date").innerText = object.date;
    document.getElementById("type").innerText = object.type;
    document.getElementById("priority").innerText = object.priority; 
    document.getElementById("status").innerText = object.status;
    document.getElementById("description").innerText = object.description;
    document.getElementById("chatbox").innerText = object.chats;
	}).catch(() => { 
	  alert('something went wrong');
	});
}

function statusUpdate(element) {
  let newStatus = element.value;
  let p = fetch(url + "/post/updtStat", {
    method: 'POST', 
    body: JSON.stringify({stat: newStatus}),
    headers: {"Content-Type": "application/json"}
    });
    p.then(() => { 
      console.log('Status Updated');
      alert("Status updated!");
      showTicket();
    });
    p.catch(() => { 
      alert('something went wrong');
    });
}

showTicket();
