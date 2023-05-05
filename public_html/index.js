/*  Author:     Carlton Louie, Brenda Coutino, Kianny Calvo
    Class:      CSC 337
    File:       client.js
    Assignment: Final Project
    This file is the JS for the login page
    */


var loginU = document.getElementById("loginU");
var loginP = document.getElementById("loginP");

// Logs user into website
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
         }),
        redirect: "follow"
    };

    fetch(url + '/login', requestOptions)
        .then((response) => {
            if(response.redirected == true){
                window.location.href = response.url;
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

// Registers a user on the website
function register(){
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
