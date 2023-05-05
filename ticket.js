/*	Author: 	Carlton Louie, Kianny Calvo, Brenda Coutino
	Class:		CSC 337
	File:		ticket.js
	Assignment:	Final Project
	This file is the javascript for the ticket page functionality.
*/


// openForm allows the user to open the chat area

function openForm () {
    document.getElementById("chat-form").style.display = "block";
}

// closeForm allows the user to hide the chat area

function closeForm () {
    document.getElementById("chat-form").style.display = "none";
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

// alert user of successful status update 

function statusAlert() {
	alert("Status updated!");
}
