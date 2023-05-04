/*	Author: 	Carlton Louie, Brenda Coutino
	Class:  	CSC 337
	File:		client.js
	Assignment:	Final Project
	This file is the JS for the client-side of the service desk
	*/
var t = document.getElementById("title").value;
var d = document.getElementById("desc").value;
var p = document.getElementById("priority").value;
var s = document.getElementById("stat").value;
var y = document.getElementById("type").value;
var a = document.getElementById("date").value;

var data = { title: t, 
    desc: d,
    price: p,
    status: s,
    image: i
};

var url = "" //  TODO: add url

//  Adds a ticket
function addTicket(){ 
    let u = iUsr.value;
    let t = title.value;
    let d = desc.value;
    let p = price.value;
    let i = image.value;
    let s = itemStatus.value;
    
    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: t,
            desc: d,
            price: p,
            image: i,
            status: s
         })
    };

    fetch(url+'/add/item/'+u, requestOptions)
        .then(response => {
            if(response.redirected == true){
                window.location.href = response.url;
                console.log(response);
            }
        })
        .catch((error) => {
            console.log(error)
        });
}

var loginU = document.getElementById("loginU");
var loginP = document.getElementById("loginP");

//  Logs user into website checking if account is already existing
function login(){ 
    let u = loginU.value;
    let p = loginP.value;
    validUsrName = loginU.value;

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username : u,
            password: p,
            //credentials: "same-origin"
         }),
        redirect: "follow"
    };

    fetch(url + '/login', requestOptions)
        .then((response) => {
            if(response.redirected == true){
                window.location.href = response.url;
                //window.location.href = response.headers.get("Location");
            }
            else{
                response.text()
                .then((text) =>{
                    usrMsg.innerText = "Error logging in with that info";
                });
            }
        })
        .catch((error) => {
            console.log(error)
        });
}

var regU = document.getElementById("regU");
var regP = document.getElementById("regP");

//  Creates an account
function create(){
    let u = regU.value;
    let p = regP.value;

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username : u,
            password: p
         })
    };

    fetch(url + '/add/user/', requestOptions)
        .then((response) => response.text())
        .then((text) => {
            alert(text);
        });
}

//  Adds a ticket
function viewTicket(){ 
    //  TODO
}

//  Adds a ticket
function getUsrTicket(){ 

    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Error');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.responseURL == url + '/'){
                window.location.href = httpRequest.responseURL;
                //window.location.href = response.headers.get("Location");
                console.log(response);
            }
            else if (httpRequest.status === 200) {
                showListings(httpRequest.responseText);
            } 
            else { alert('Error fetching Items'); }
        }
    }

    httpRequest.open('GET', url + "/get/listings/");
    httpRequest.send();
}
