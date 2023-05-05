/*  Author:     Carlton Louie, Brenda Coutino, Kianny Calvo
    Class:      CSC 337
    File:       client.js
    Assignment: Final Project
    This file is the JS for the client home of the service desk
    */

function createTicket() {
	let u = document.getElementById('name').value;
	let d = new Date();
	let t = document.getElementById('title').value;
	let desc = document.getElementById('desc').value;
	let priority = document.getElementById('priority').value;
	// these two var and for loop get the user selected radio value
	var requestType = document.getElementsByName('type');
	var rt;
	for(var i = 0; i < requestType.length; i++) {
    	if(requestType[i].checked) {
        	t = requestType[i].value;
			break;
    	}
	}
	let s = "Open"
	// url and data are for the fetch request
	let url = '/post/newTicket/';
	let data = { user: u, date: d, title: t, desc: desc, 
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
	  //viewTickets(); need to create
	});
	p.catch(() => { 
	  alert('something went wrong');
	});
  }
