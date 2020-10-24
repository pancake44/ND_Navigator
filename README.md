# paradigms-fa20-web_startup

TODO (monday)
 + fix the thing to allow importing from another directory (server/placesController and server/server need to import ooapi/place_library)
 + implement reset? implement delete? and corresponding tests
 + finish this readme

## Group Members
 - Harrison Snow (hsnow)
 - Gerry Fernandez (gfernnan2)

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
  + Currently we are using the port assigned to Harry, so port 51040. The server runs on localhost.




