# ND_Navigator

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
   + Currently we are using the port assigned to Harry, so port 51040. The server runs on student04.cse.nd.edu.

## User Interaction
 + Preparation
   + Before going to the website, ensure that the server is running on student04.cse.nd.edu
   + Visit the [website](http://hsnow567.gitlab.io/paradigms-fa20-web_startup/jsfrontend/index_map.html) to interact with the client
 + Main Page Interaction
   + In the first dropdown, select starting location
   + Press "Add" to add a destination. Up to 9 destinations can be added.
   + Press "Submit", and the chosen locations will appear on the map, and table of directions will appear
   + The "Directions" column gives the distance and direction necessary to reach the location from the previous location
   + After submitting, below the map will appear an "Info Table"
   + After clicking a row of the "Info Table", a pop-up will appear which allows the user to enter a review for the given location.
   + To submit a review, fill in the text box and click "submit" to submit the review
   + To add a new location to the website, click "Suggest" on the top navbar
 + Suggest Page Interaction
   + Fill out the necessary information
   + Click "Submit" to add location to website

## Complexity
 + Data source contains 582 entries, each containing information about a place on/around Notre Dame campus.
   + Each entry contains lots of information, but only crucial information such as name, lat/long coordinates, and description are included in the backend
 + Client utilizes Google Maps API
 + Heavy use of dynamic elements
   + Dynamic dropdown elements which are appended to the page
   + Dynamic direction table to the right of the map
   + Dynamic information table below the map, with each row being clickable
     + Clicking a row creates a dynamically-build pop-up for entering a review and seeing past reviews of the place
   + Dynamic hiding/showing between the destination dropdowns and direction tables
   + Various dynamically-created buttons
 + Basic CSS styling (fonts, colors)

## Presentation
 + Link to demonstration video: [Demonstration Video]
 + Link to code walkthrough video: [Code Walkthrough Video]
 + Link to presentation slides: [Google Slides]

[Demonstration Video]: https://drive.google.com/file/d/1CCY8_cu68uU2gYtqabO5U7idbL2ey431/view?usp=sharing
[Code Walkthrough Video]: https://drive.google.com/file/d/1c9r2KKI4fEMhkgIbGtgCM-Imydv4auec/view?usp=sharing
[Google Slides]: https://docs.google.com/presentation/d/1_6-byfyA9fM4opRT_4Z_3qjSMbKP0AeM4naKocOPtt8/edit?usp=sharing
