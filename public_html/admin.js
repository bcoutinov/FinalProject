/*	Author: 	Carlton Louie, Brenda Coutino, Kianny Calvo
	Class:  	CSC 337
	File:		admin.js
	Assignment:	Final Project
	This file is the JS for the admin-side of the service desk
	*/


// Takes tickets and displays them on the webpage
function showtickets(){
	
}


// Takes items and displays them on the webpage
function showListings(responseText){
    let listings = JSON.parse(responseText);
    let listingStrings = [];

    for (let i in listings){
        console.log(listings[i].title);
        let listingString = '<div class="listing">';
        let title = '<h3 class="listingTitle">' + listings[i].title + '</h3>';
        let ps = '<h4 class="ps"> Price: $' + listings[i].price + '\t Status: ' + listings[i].stat + '</h4>';
        let desc = '<p>' + listings[i].description + '</p>';

        if (listings[i].stat != 'sold'){
            let pFunc = "purchase('"+listings[i]._id+"');"
            var pButton =  '<button type="submit" onclick="'+pFunc+'">Buy</button>';
        }
        else{
            var pButton = '<p>SOLD</p>';
        }

        listingString = listingString + title + ps + desc + pButton + "</div>";
        listingStrings.push(listingString);
    }

    let htmlText =  listingStrings.join("");

    itemDisp.innerHTML = htmlText;
}
