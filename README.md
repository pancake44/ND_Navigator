# ND_Navigator

## Group Members
 - Harrison Snow (hsnow)
 - (gfernnan2)

## OO API
 + Explanation of functions
   + load_places(place_file)
     + opens .json containing landmark data and loads data into running server database dictionaries
   + get_places()
     + returns keys server_names dict for use in loops
   + get_place(plid)
     + takes in place ID (plid) and returns list of information (name, x and y coordinates, adds (visitor count), reviews) from entry in server database
   + set_place(plid, place)
     + takes in new place data and updates place entry at plid with new information
   + incr_adds(plid)
     + increments (by 1) visitor count for place entry at plid
 + How to run test
   + run test_library.py with python3

## JSON Specification
 + RESTful API
   + Request type: GET  | Resource: /places/:plid
     + Returns specific place information
   + Request type: PUT  | Resource: /places/:plid
     + Uses information in message body to update specific place information 
   + Request type: GET  | Resource: /places/
     + Returns information for all places in database
   + Request type: POST | Resource: /places/
     + Creates new place entry using information in message body and returns place ID of new entry
 + How to run tests
   + Run server.py with python3 (cherrypy required)
   + Run test_places_index.py or test_places_key.py
   + Restart server before running the other test
 + Usage Details
   + Our server intends to be used as a private backend for our frontend client, so users should not interact with the server directly (which might require some form of CORS implementation)
   + Our frontend client would facilitate the proper requests to this webservice, such as GETing place information (like during an initial page load, or retrieving coordinates for path calculations on the clientside), PUTing information (such as when a user wants to submit a review), and POSTing when needed (such as when a user wants to add a location).
   + Currently we are using the port assigned to Harry, so port 51040. The server runs on student04.cse.nd.edu.

## User Interaction
 + Preparation
   + Before going to the website, ensure that the server is running on student04.cse.nd.edu
   + Visit the [website](http://hsnow567.gitlab.io/paradigms-fa20-web_startup/jsfrontend/index_map.html) to interact with the client (IF SERVER ISN'T RUNNING, WON'T BE ABLE TO INTERACT WITH CLIENT)
 + Interaction
   + In the first dropdown, select starting location
   + Press "Add" to add a destination. Any number of destinations can be added.
   + Press "Submit", and the chosen locations will appear on the map, and table of directions will appear
   + The "Directions" column gives the distance and direction necessary to reach the location from the previous location
   + Additional functionalities are planned
