/*  Author:     Carlton Louie, Brenda Coutino, Kianny Calvo
    Class:      CSC 337
    File:       client.js
    File:       home.js
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
            rt = requestType[i].value;
            break;
        }}
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

// displays all client tickets
  function viewClientTickets () {
	let url = '/home/'; 
	let p = fetch(url);
	let ps = p.then( (response) => {
	  return response.json();
	}).then((objects) => { 
	// appends tickets to client table
		let html = "";
		let table = document.getElementById("client-ticket-table");
		for (i in objects) {
			var buttonValue = object[i]._id.slice(18,23);
			html = '<input type="button" value=\''+ buttonValue +'\' class="view-ticket" onclick="openTicket(this)">'
			var row = document.createElement("tr");
			var c1 = document.createElement("td");
			var c2 = document.createElement("td");
			var c3 = document.createElement("td");
			c1.innerHTML = html;
			c2.innerText = objects[i].date;
			c3.innerText = objects[i].priority;
			row.appendChild(c1);
			row.appendChild(c2);
			row.appendChild(c3);
			table.appendChild(row);
			row.setAttribute("id", object[i]._id);
		}
	}).catch(() => { 
		alert('something went wrong');
	  });
	}
