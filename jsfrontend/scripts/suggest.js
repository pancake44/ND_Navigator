// respond to button click
console.log("page load");

var sendButton = document.getElementById('send-button');
sendButton.onmouseup = getFormInfo;

function getFormInfo(){
	console.log("entered get form info")

	var HOST = "http://student04.cse.nd.edu"
	
	var PORT = "51040"
	
	var URI = HOST + ":" + PORT + "/places/";
	
	var HTTP = "POST";  
	
	var body = {};
	// fill message body
	body['name'] = "place_name";
	body['name'] = document.getElementById('input-name').value;

	body['xcord'] = 0;
	body['xcord'] = document.getElementById('input-long').value;
	
	body['ycord'] = 0;
	body['ycord'] = document.getElementById('input-lat').value;
	
	body['description'] = "";
	body['description'] = document.getElementById('input-desc').value;

	body['adds'] = null;
	body['reviews'] = null;

	var BODY = JSON.stringify(body);

	console.log(BODY);

	var reqInfo = {};
	reqInfo.HTTP = HTTP;
	reqInfo.URI = URI;
	reqInfo.BODY = BODY;
	
	console.log(reqInfo);
	
	networkCall(reqInfo); 
}

function networkCall(reqInfo){
	var xhr = new XMLHttpRequest();
  
  xhr.open(reqInfo.HTTP, reqInfo.URI, true);
  
  xhr.onload = function(e) {
	  console.log(xhr.responseText);
  }
  
  xhr.onerror = function(e){
	  console.error(xhr.statusText);
  }
	
  xhr.send(reqInfo.BODY);
  
}
