console.log("load page");

this.renderMap();
var destCount = 1;
var markerArr = [];
addDest();

var submitButton = document.getElementById("bsr-submit-button");
submitButton.onmouseup = getFormInfo;

function getFormInfo(){
	console.log("getting form info");
	var names = document.getElementsByName("dest");
	var selections = [];
	for(let i = 0; i < names.length; i++){
		console.log(names[i].options[names[i].selectedIndex].value);
		selections.push(names[i].options[names[i].selectedIndex].value);
	}
	
	makeDirTable(selections);
	// makeInfoTable(selections);
}

/* Load the google maps window */
function loadScript(url) {
	var index = window.document.getElementsByTagName("script")[0];
	var script = window.document.createElement("script");
	script.src = url;
	script.async = true;
	script.defer = true;
	index.parentNode.insertBefore(script, index);
}

/* Render the Google Map */
function renderMap() {
	console.log("map render");
	loadScript(
	"https://maps.googleapis.com/maps/api/js?key=AIzaSyDwPd5fkbDSNmd5s3wWcGAKh1wOUcHwPOw&callback=initMap"
	);
	window.initMap = this.initMap;
}

var myStyles = [
	{
	featureType: "poi",
	elementType: "labels",
	stylers: [{ visibility: "off" }],
	},
];

/* Set map values and add markers to the map */
var map;
function initMap() {
	map = new window.google.maps.Map(document.getElementById("map"), {
	center: { lat: 41.701175, lng: -86.236569 },
	mapTypeId: "terrain",
	zoom: 16,
	myStyles,
	});
}

async function addDest(){
	console.log("adding another selection");

	// Create a new form group div
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "form-group");
	newDiv.setAttribute("id", "origFormDiv");

	// Create a label (w/text) for new select 
	newLab = document.createElement("label");
	newLab.setAttribute("for", "dest" + destCount);
	newLab.setAttribute("id", "dest" + destCount);
	var newLabText;
	if(destCount == 1)
		newLabText = document.createTextNode("Starting location ");
	else
		newLabText = document.createTextNode("Destination " + (destCount - 1));
	newLab.appendChild(newLabText);
	newDiv.appendChild(newLab);

	// Create a new select
	newSel = document.createElement("select");
	newSel.setAttribute("id", "dest" + destCount);
	newSel.setAttribute("name", "dest");
	newSel.setAttribute("class", "form-control");

	// Load options for the new select 
	dataJSON = await getKeys("GET", null);
	console.log("dataJSON" + dataJSON);
	data = JSON.parse(dataJSON);
	console.log("data" + data);
	var newOptText;
	var newOpt;
	for(let i = 0; i < data["places"].length; i++) {
		newOpt = document.createElement('option');
		newOpt.setAttribute("value", i);
		newOptText = document.createTextNode(data["places"][i].name);
		newOpt.appendChild(newOptText);
		newSel.appendChild(newOpt);
	}

	/* Add the new sel to new div */
	newDiv.appendChild(newSel);

	/* Add the new div to DOM */
	console.log("responseDiv: " + "here" + destCount);
	var responseDiv = document.getElementById("here" + destCount);
	responseDiv.appendChild(newDiv);

	/* Add a new p to DOM for future field adds */
	newP = document.createElement("p");
	newP.setAttribute("id", "here" + ++destCount);
	responseDiv.appendChild(newP);
}

async function makeDirTable(selections){
	console.log("entered make dir table");

	/* Create a new div for the table */
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "table-responsive");

	/* Create a table */
	newTab = document.createElement("table");
	newTab.setAttribute("class", "table");

	/* Populate the header row */
	newThead = document.createElement("thead");
	newTrow = document.createElement("tr");

	// Order
	var newThText;
	newTh = document.createElement("th");
	newTh.setAttribute("scope", "col");
	newThText = document.createTextNode("#");
	newTh.appendChild(newThText);
	newTrow.appendChild(newTh);
	// Destination
	newTh = document.createElement("th");
	newTh.setAttribute("scope", "col");
	newThText = document.createTextNode("Destination");
	newTh.appendChild(newThText);
	newTrow.appendChild(newTh);
	// Destination
	newTh = document.createElement("th");
	newTh.setAttribute("scope", "col");
	newThText = document.createTextNode("Direction");
	newTh.appendChild(newThText);
	newTrow.appendChild(newTh);

	// Append header row to table
	newThead.appendChild(newTrow);
	newTab.appendChild(newThead);

	newTbody = document.createElement("tbody");
	
	var newTbText;
	var oldxcord;
	var oldycord;
	var newxcord;
	var newycord;
	for(let i = 0; i < selections.length; i++){
		dataJSON = await getKeys("GET", selections[i]);
		data = JSON.parse(dataJSON);
		
		newTr = document.createElement("tr");
		newTr.setAttribute("class", "accordion-toggle collapsed");
		
		// Order
		newTd = document.createElement("td");
		newTbText = document.createTextNode(i+1);
		newTd.appendChild(newTbText);
		newTr.appendChild(newTd);

		// Destination
		newTd = document.createElement("td");
		newTbText = document.createTextNode(data["name"]);
		newTd.appendChild(newTbText);
		newTr.appendChild(newTd);

		if(i == 0){
			newTbody.appendChild(newTr);
			newTab.appendChild(newTbody);
			newDiv.appendChild(newTab);
			// used for calculating distance and direction
			oldxcord = data["xcord"];
			oldycord = data["ycord"];
		}
		else{
			// calculate distance and direction from xcord and ycord, then put in table
			newxcord = data["xcord"];
			newycord = data["ycord"];
			
			console.log("Distance coords: " + oldxcord + " " + oldycord + " " + newxcord + " " + newycord);
			console.log("Distance: " + getDistance(oldxcord, oldycord, newxcord, newycord));
			console.log("Bearing: " + getBearing(oldxcord, oldycord, newxcord, newycord));
			
			newTd = document.createElement("td");
			// put distance and direction into table entry
			newTbText = document.createTextNode(getDistance(oldxcord, oldycord, newxcord, newycord).toFixed(0) + " m   " + getCardinal(getBearing(oldxcord, oldycord, newxcord, newycord)));
			newTd.appendChild(newTbText);
			newTr.appendChild(newTd);
			
			// Append table row to table body
			newTbody.appendChild(newTr);
			newTab.appendChild(newTbody);
			newDiv.appendChild(newTab);

			// preserve coordinates for next point
			oldxcord = data["xcord"];
			oldycord = data["ycord"];
		}

		var mark = new google.maps.Marker({
			position: {lat: parseFloat(data["ycord"]), lng: parseFloat(data["xcord"])},
			map: map,
		});
		markerArr.push(mark);
	}

	/* Create reset button */
	newBut = document.createElement("button");
	newBut.setAttribute("type", "button");
	newBut.setAttribute("class", "btn btn-primary");
	newBut.setAttribute("onclick", "showForm()");
	var newButText = document.createTextNode("Return to form");
	newBut.appendChild(newButText);

	// Hide form
	var rhsDiv = document.getElementById("rhs");
	rhsDiv.style.display = (
	rhsDiv.style.display == "none" ? "block" : "none"
	);

	// Show table
	var responseDiv = document.getElementById("tab");
	responseDiv.appendChild(newDiv);
	responseDiv.appendChild(newBut);
}

/*
function resetForm(){

	let i = 1;
	while(formP = document.getElementById("here" + i)){
	formP.remove();
	i++;
	}

	destCount = 2;
	var responseDiv = document.getElementById("addButton")
	newP = document.createElement("p");
	newP.setAttribute("id", "here1");
	responseDiv.parentNode.insertBefore(newP, responseDiv);
}
*/

function showForm(){
	 
	// Clear tables
	var tabDiv = document.getElementById("tab");
	tabDiv.innerHTML = "";

	var tabInfo = document.getElementById("dtable");
	tabInfo.style.display = "none";

	// Show the user's previous form state
	var rhsDiv = document.getElementById("rhs");
	rhsDiv.style.display = (
	rhsDiv.style.display == "none" ? "block" : "none"
	);
}

function makeInfoTable(selections){
	console.log("entered make info table");

	var tabBody = document.getElementById("tbody");
	for(let i = 0; i < selections.length; i++){

	// New row
	newTr = document.createElement("tr");

	// Index
	newTd_I = document.createElement("td");
	var newTd_I_Text = document.createTextNode(i+1);
	newTd_I.appendChild(newTd_I_Text);
	newTr.appendChild(newTd_I);

	// Description
	newTd_D = document.createElement("td");
	var newTd_D_Text = document.createTextNode(selections[i]);
	newTd_D.appendChild(newTd_D_Text);
	newTr.appendChild(newTd_D);

	// Review
	newTd_R = document.createElement("td");
	var newTd_R_Text = document.createTextNode(selections[i]);
	newTd_R.appendChild(newTd_R_Text);
	newTr.appendChild(newTd_R);

	// Add row to table body
	tabBody.append(newTr);
	}

	// Make table visible
	var tab = document.getElementById("dtable");
	tab.style.display = "block";
}


function getKeys(REST, KEY/*, callback*/){
	return new Promise(function (resolve, reject) {
		console.log("entered getKeys")
		console.log("REST: " + REST);
		
		var HOST = "http://student04.cse.nd.edu"	
		var PORT = "51040"
		
		var URI = HOST + ":" + PORT + "/places/";
		var HTTP = REST
		if(KEY)
			URI += KEY;
		
		var reqInfo = {};
		reqInfo.HTTP = HTTP;
		reqInfo.URI = URI;
		
		console.log(reqInfo);
		
		var xhr = new XMLHttpRequest();
		
		xhr.open(reqInfo.HTTP, reqInfo.URI, true);

		xhr.onload = function(e) {
			console.log("responseText" + xhr.responseText);
			//callback(xhr.responseText);
			resolve(xhr.responseText);
		}
		
		xhr.onerror = function(e){
			console.error(xhr.statusText);
			reject({
                status: this.status,
                statusText: xhr.statusText
            });
		}

		xhr.send(reqInfo.BODY);
	});
}


/*
function networkCall(reqInfo){
	console.log("entered networkCall");
	var xhr = new XMLHttpRequest();
	
	xhr.open(reqInfo.HTTP, reqInfo.URI, true);
	
	xhr.onload = function(e) {
		console.log("responseText" + xhr.responseText);
		return xhr.responseText;
	}
	
	xhr.onerror = function(e){
		console.error(xhr.statusText);
	}
	
	xhr.send(reqInfo.BODY);
}
*/

// simple math functions for distance and direction
// ripped from http://www.movable-type.co.uk/scripts/latlong.html
const R = 6371e3; // radius of Earth, metres

// takes latlong coords and returns distance in meters (Haversine formula)
function getDistance(lon1, lat1, lon2, lat2){
	var φ1 = lat1 * Math.PI/180;
	var φ2 = lat2 * Math.PI/180;
	var Δλ = (lon2-lon1) * Math.PI/180
	return Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
}

// takes latlong coords and returns bearing in degrees
function getBearing(lon1, lat1, lon2, lat2){
	var φ1 = lat1 * Math.PI/180;
	var φ2 = lat2 * Math.PI/180;
	var Δλ = (lon2-lon1) * Math.PI/180;
	var y = Math.sin(Δλ) * Math.cos(φ2);
	var x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
	var θ = Math.atan2(y, x);
	return (θ*180/Math.PI + 360) % 360;
}

// convers bearing to cardinal direction
// ripped from https://gist.github.com/basarat/4670200 - not going to reinvent the wheel
const degreePerDirection = 360 / 8;

function getCardinal(bearing){
	var offsetAngle = bearing + degreePerDirection / 2;

  	return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "N"
		: (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "NE"
		: (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "E"
		: (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "SE"
		: (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "S"
		: (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "SW"
		: (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "W"
		: "NW";
}


