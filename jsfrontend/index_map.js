console.log("load page");

this.renderMap();
var destCount = 1;
var markerArr = [];
addDest();

var submitButton = document.getElementById("bsr-submit-button");
submitButton.onmouseup = getFormInfo;

async function getFormInfo(){
	console.log("getting form info");
	var names = document.getElementsByName("dest");
	var selections = [];
	for(let i = 0; i < names.length; i++){
		console.log(names[i].options[names[i].selectedIndex].value);
		selections.push(names[i].options[names[i].selectedIndex].value);
	}
	
	await clearMarkers();
	makeDirTable(selections);
	makeInfoTable(selections);
}

function clearMarkers() {
	return new Promise(function(){
  		renderMap();
	});	
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
	var newLabText = document.createTextNode("Destination " + destCount);
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
		}
		else{
			// TODO: calculate distance and direction from xcord and ycord, then put in table
			// (rn it just puts xcord in the table)
			newTd = document.createElement("td");
			newTbText = document.createTextNode(data["xcord"]);
			newTd.appendChild(newTbText);
			newTr.appendChild(newTd);
			
			// Append table row to table body
			newTbody.appendChild(newTr);
			newTab.appendChild(newTbody);
			newDiv.appendChild(newTab);
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
		
		var HOST = "http://student10.cse.nd.edu"	
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




