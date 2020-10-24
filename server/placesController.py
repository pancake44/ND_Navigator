import cherrypy
import re, json
import sys
import pathlib
sys.path.append(str(pathlib.Path(__file__).parent.absolute()) + '/../ooapi/')
from place_library import _place_database

class PlaceController(object):
	
	def __init__(self, ndp=None):
		if ndp is None:
			self.ndp = _place_database()
		else:
			self.ndp = ndp
			self.ndp.load_places('ndplaces.json')

	def GET_KEY(self, place_id):
		'''when GET request for /places/place_id comes in, then we respond with json string'''
		output = {'result':'success'}
		place_id = int(place_id)

		try:
			place = self.ndp.get_place(place_id)
			if place is not None:
				output['id'] = place_id
				output['name'] = place[0]
				output['xcord'] = place[1]
				output['ycord'] = place[2]
				output['adds'] = place[3]
				output['reviews'] = place[4]
			else:
				output['result'] = 'error'
				output['message'] = 'place not found'
		except Exception as ex:
			output['result'] = 'error'
			output['message'] = str(ex)
			
		return json.dumps(output)


	def PUT_KEY(self, place_id):
		'''when PUT request for /places/place_id comes in, then we update adds and review as needed'''
		output = {'result':'success'}
		place_id = int(place_id)

		data = json.loads(cherrypy.request.body.read().decode('utf-8'))

		try:
			place = list()
			place.append(data['name'])
			place.append(data['xcord'])
			place.append(data['ycord'])
			place.append(data['adds'])

			self.ndp.set_place(place_id, place)
		
			self.ndp.incr_adds(place_id)
		except Exception as ex:
			output['result'] = 'error'
			output['message'] = 'error updating place'

		return json.dumps(output)
	

	def GET_INDEX(self):
		'''when GET request for /places/ comes in, we respond with all the place information in a json str'''
		output = {'result':'success'}
		output['places'] = []
		
		try:
			for plid in self.ndp.get_places():
				place = self.ndp.get_place(plid)
				dplace = {'id':plid, 'name':place[0], 'xcord':place[1], 'ycord':place[2], 'adds':place[3], 'reviews':place[4]}
				output['places'].append(dplace)
		except Exception as ex:
			output['result'] = 'error'
			output['message'] = str(ex)

		return json.dumps(output)
	
	def POST_INDEX(self):
		'''when POST for /places/ comes in, we take place info from body of request, and respond with the new place_id and more'''
		output = {'result':'success'}
		place_id = int(max(self.ndp.get_places())) + 1
		output['id'] = place_id
		
		data = json.loads(cherrypy.request.body.read().decode('utf-8'))
		
		place = list()
		place.append(data['name'])
		place.append(data['xcord'])
		place.append(data['ycord'])
		place.append(data['adds'])
		
		self.ndp.set_place(place_id, place)

		return json.dumps(output)
