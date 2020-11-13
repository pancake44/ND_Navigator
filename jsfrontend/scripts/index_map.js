console.log("load page");

// The map
var map;
// Render the map on page load
this.renderMap();
// Only one location selected by default
var destCount = 1;
// Array to store markers for map
var markerArr = [];
// Array to choose destination choices
var selections = [];
// Add the first dropdown to page on load
addDest();
// Keeps track of item bein examined in info table`
var currentItem;

var submitButton = document.getElementById("bsr-submit-button");
submitButton.onmouseup = getFormInfo;


/*** MAP FUNCTIONS ***/

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

/* Set map values and add markers to the map */
function initMap() {
	map = new window.google.maps.Map(document.getElementById("map"), {
	center: { lat: 41.701175, lng: -86.236569 },
	mapTypeId: "terrain",
	zoom: 16
	});
}

/* Add markers in array to map */
function setMapAll(){
	initMap();
	for(let i = 0; i < markerArr.length; i++)
		markerArr[i].setMap(map);
	markerArr = [];
}


/*** NAVBAR FUNCTIONS ***/

function showLinks(i){
	document.getElementById("dropdown-content" + i).classList.toggle("show");
}

function addPlace(){
	window.location.href = "suggest.html";
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/*** FORM AND DIRECTION TABLE FUNCTIONS ***/

/* On submission of form, put the selections into a global array and
   construct two tables */
function getFormInfo(){
	console.log("entered getFormInfo");

	selections = []; // Clear array from previous form sumbissions
	var names = document.getElementsByName("dest");
	for(let i = 0; i < names.length; i++){
		console.log(names[i].options[names[i].selectedIndex].value);
		selections.push(names[i].options[names[i].selectedIndex].value);
		console.log("selection: " + selections[i]);
	}
	
	makeDirTable();
	makeInfoTable();
}

/* Add a nother dropdown selection to the form */
async function addDest(){
	console.log("entered addDest");

	if(destCount > 10)
		return;

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

	// Add the new sel to new div 
	newDiv.appendChild(newSel);

	// Add the new div to DOM 
	console.log("responseDiv: " + "here" + destCount);
	var responseDiv = document.getElementById("here" + destCount);
	responseDiv.appendChild(newDiv);

	// Add a new p to DOM for future field adds 
	newP = document.createElement("p");
	newP.setAttribute("id", "here" + ++destCount);
	responseDiv.appendChild(newP);
}

/* Creates the table with directions between locations */
async function makeDirTable(){
	console.log("entered make dir table");

	// Create a new div for the table 
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "table-responsive");

	// Create a table 
	newTab = document.createElement("table");
	newTab.setAttribute("class", "table");

	// Populate the header row 
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

	// Create body and populate with data from server
	newTbody = document.createElement("tbody");

	var newTbText;
	var oldxcord;
	var oldycord;
	var newxcord;
	var newycord;
	for(let i = 0; i < selections.length; i++){

		// Make one server request per key
		dataJSON = await getKeys("GET", selections[i]);
		data = JSON.parse(dataJSON);
		
		// New row
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
		// Calculate direction
		if(i == 0){
			newTbody.appendChild(newTr);
			newTab.appendChild(newTbody);
			newDiv.appendChild(newTab);
			// used for calculating distance and direction
			oldxcord = data["xcord"];
			oldycord = data["ycord"];
		}
		else{
			// Calculate distance and direction from xcord and ycord, then put in table
			newxcord = data["xcord"];
			newycord = data["ycord"];
			
			console.log("Distance coords: " + oldxcord + " " + oldycord + " " + newxcord + " " + newycord);
			console.log("Distance: " + getDistance(oldxcord, oldycord, newxcord, newycord));
			console.log("Bearing: " + getBearing(oldxcord, oldycord, newxcord, newycord));
			
			newTd = document.createElement("td");
			// Put distance and direction into table entry
			newTbText = document.createTextNode(getDistance(oldxcord, oldycord, newxcord, newycord).toFixed(0) + " m   " + getCardinal(getBearing(oldxcord, oldycord, newxcord, newycord)));
			newTd.appendChild(newTbText);
			newTr.appendChild(newTd);
			
			// Append table row to table body
			newTbody.appendChild(newTr);
			newTab.appendChild(newTbody);
			newDiv.appendChild(newTab);

			// Preserve coordinates for next point
			oldxcord = data["xcord"];
			oldycord = data["ycord"];
		}

		// Make a marker object and add to array
		var lab = (i+1).toString();
		var mark = new google.maps.Marker({
			position: {lat: parseFloat(data["ycord"]), lng: parseFloat(data["xcord"])},
			label: lab,
		});

		markerArr.push(mark);
	}

	// Create back button 
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

	// Add markers to map
	setMapAll();
}

/* Hide the direction table and pull up the previous form */
function showForm(){
	 
	// Clear previous direction table
	var tabDiv = document.getElementById("tab");
	tabDiv.innerHTML = "";

	// Show the user's previous form state
	var rhsDiv = document.getElementById("rhs");
	rhsDiv.style.display = (
		rhsDiv.style.display == "none" ? "block" : "none"
	);
}


/*** INFO TABLE FUNCTIONS ***/

// Build a table to show place description and reviews
async function makeInfoTable(){
	console.log("entered make info table");
	
	currentItem = 0;
	
	// Clear previous table
	var tabBody = document.getElementById("tbody");
	tabBody.innerHTML = "";

	// Add a row entry for each destination
	for(let i = 0; i < selections.length; i++){

		dataJSON = await getKeys("GET", selections[i]);
		data = JSON.parse(dataJSON);

		// New row
		newTr = document.createElement("tr");
		newTr.setAttribute("data-toggle","modal");
		newTr.setAttribute("data-target","#mod");
		newTr.setAttribute("data-id", i);

		// Index
		newTd_I = document.createElement("td");
		newTd_I.setAttribute("name","dtd");
		var newTd_I_Text = document.createTextNode(i+1);
		newTd_I.appendChild(newTd_I_Text);
		newTr.appendChild(newTd_I);
		
		// Location
		newTd_L = document.createElement("td");
		newTd_L.setAttribute("name","dtd");
		var newTd_L_Text = document.createTextNode(data["name"]);
		newTd_L.appendChild(newTd_L_Text);
		newTr.appendChild(newTd_L);
	
		// Description
		newTd_D = document.createElement("td");
		newTd_D.setAttribute("name","dtd");
		var newTd_D_Text = document.createTextNode(data["description"]);	
		newTd_D.appendChild(newTd_D_Text);
		newTr.appendChild(newTd_D);

		// Review
		newTd_R = document.createElement("td");
		newTd_R.setAttribute("name","dtd");
		var newTd_R_Text;
		if(data["reviews"][0])
			for(let j = 0; j < data["reviews"].length; j++)
				newTd_R_Text = document.createTextNode(data["reviews"][j]);
		else
			newTd_R_Text = document.createTextNode("No reviews yet");
		newTd_R.appendChild(newTd_R_Text);
		newTr.appendChild(newTd_R);

		// Add row to table body
		tabBody.append(newTr);
	}

	// Make table visible
	var tab = document.getElementById("dtable");
	tab.style.display = "block";

	// Make table rows clickable
	addRowHandlers();
}

// Makes table rows clickable	
function addRowHandlers(){
	console.log("entered addRowHandlers");

	var table = document.getElementById("tabled");
	var rows = table.getElementsByTagName("tr");
	var i;
	for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
    	var createClickHandler = function(row) {
      		return function() {
        		var cell = row.getElementsByTagName("td")[0];
        		var id = cell.innerHTML;
				currentItem = row.rowIndex - 1;
				review();
      		};
    	};
    	currentRow.onclick = createClickHandler(currentRow);
  	}
}

// Pulls up modal to view/add reviews
function review(){
	console.log("entered review");

	document.getElementById("myModal").style.display= "block";

	var modal = document.getElementById("myModal");
	var btn = document.getElementById("myBtn");
	var span = document.getElementsByClassName("close")[0];

	// Clear and close modal
	span.onclick = function() {
  		clearReview();
		modal.style.display = "none";
	}	

	window.onclick = function(event) {
		if (event.target == modal) {
			clearReview();
    		modal.style.display = "none";
  		}
	}

	popReview();
}

// Add previous reviews to the modal
async function popReview(){
	console.log("entered popReview");
	
	dataJSON = await getKeys("GET", selections[currentItem]);
	data = JSON.parse(dataJSON);

	// If no reviews, display and exit
	if(!data["reviews"] || typeof data["reviews"][0] == "undefined"){
		responseDiv = document.getElementById("reviewtag1");
		responseDiv.innerHTML = "No reviews yet";
		return;
	}

	// Add first review to prexisting tag
	responseDiv = document.getElementById("reviewtag1");
	responseDiv.innerHTML = data["reviews"][data["reviews"].length - 1];
	responseDiv.setAttribute("style", "resize: none; border: none;");

	var j = data["reviews"].length;
	var stop = 0;
	if(j > 10)
		stop = data["reviews"].length - 10;

	// Generate new tags and add subsequent reviews
	for(j = data["reviews"].length - 2; j >= stop; j--){
		
		newDivF = document.createElement("div");
		newDivF.setAttribute("class", "form-group");

		newDivC = document.createElement("div");
		newDivC.setAttribute("class", "col-md-12");

		newTA = document.createElement("textarea");
		newTA.setAttribute("id", "reviewtag" + (j+2));
		newTA.setAttribute("class", "form-control");
		newTA.setAttribute("readonly", true);
		newTA.setAttribute("style", "resize: none; border: none;");
		newTA.innerHTML = data["reviews"][j];
		
		newDivC.appendChild(newTA);
		newDivF.appendChild(newDivC);
	
		formDiv = document.getElementById("wrapper");
		formDiv.appendChild(newDivF);
	}
}

// Submit a new review
async function addReview(){
	console.log("entered addReview");
	console.log("input: ", document.getElementById("textarea").value);
	console.log("selection at currentItem: " + selections[currentItem]);

	dataJSON = await getKeys("GET", selections[currentItem]);
	data = JSON.parse(dataJSON);

	// Pull the place object, and change the review field
	mbody = {"name": data["name"], "xcord": data["xcord"], "ycord": data["ycord"], "adds": data["adds"], "reviews":  document.getElementById("textarea").value, "description": data["description"]};

	// PUT to the server
	await putKeys("PUT", selections[currentItem], mbody);
}

// Clear previous reviews from the modal
function clearReview(){
	console.log("entered clearreview");
	
	if(document.getElementById("wrapper")){
		console.log("clearing review");

		// Clear all reviews
		tabDiv = document.getElementById("wrapper");
		tabDiv.innerHTML = "";
	
		// Recreate the default tag
		fg = document.createElement("div");
		fg.setAttribute("class", "form-group");

		cmd = document.createElement("div");
		cmd.setAttribute("class", "col-md-12");
		cmd.setAttribute("id", "reviewtab");

		reviewTag = document.createElement("textarea");
		reviewTag.setAttribute("class", "form-control");
		reviewTag.setAttribute("id", "reviewtag1");
		reviewTag.setAttribute("readonly", true);
		reviewTag.setAttribute("style", "resize: none; border: none;");

		cmd.appendChild(reviewTag);
		fg.appendChild(cmd);
		tabDiv.appendChild(fg);
	}	
}


/*** NETWORK FUNCTIONS ***/

//Make a PUT call
function putKeys(REST, KEY, mBODY){
	console.log("entered putKeys");

	return new Promise(function (resolve, reject) {
		console.log("entered putKeys");
		console.log("REST: " + REST);

		var HOST = "http://student04.cse.nd.edu";
		var PORT = "51040";

		var URI = HOST + ":" + PORT + "/places/" + KEY;
		var HTTP = REST;
		var BODY = JSON.stringify(mBODY);

		var reqInfo = {};
		reqInfo.HTTP = HTTP;
		reqInfo.URI = URI;
		reqInfo.BODY = BODY;

		var xhr = new XMLHttpRequest();

		xhr.open(reqInfo.HTTP, reqInfo.URI, true);

		xhr.onload = function(e) {
			console.log("responseTest" + xhr.responseText);
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

// Make a GET call (function has KEYS in the name, but can also do INDEX)
function getKeys(REST, KEY){
	return new Promise(function (resolve, reject) {
		console.log("entered getKeys");
		console.log("REST: " + REST);
		
		var HOST = "http://student04.cse.nd.edu";	
		var PORT = "51040";
		
		var URI = HOST + ":" + PORT + "/places/";
		var HTTP = REST;
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


/*** DIRECTION CALCULATION FUNCTIONS ***/

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

