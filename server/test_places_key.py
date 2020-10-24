import unittest
import requests
import json

class TestMovies(unittest.TestCase):

	SITE_URL = 'http://localhost:51040' # replace with your port number and 
	print("testing for server: " + SITE_URL)
	PLACES_URL = SITE_URL + '/places/'

	def is_json(self, resp):
		try:
			json.loads(resp)
			return True
		except ValueError:
			return False
	
	def test_places_get_key(self):
		#self.reset_data()
		place_id = 32
		r = requests.get(self.PLACES_URL + str(place_id))
		self.assertTrue(self.is_json(r.content.decode('utf-8')))
		resp = json.loads(r.content.decode('utf-8'))
		self.assertEqual(resp['name'], 'Brownson Hall')
		self.assertEqual(resp['xcord'], '-86.239368')
		self.assertEqual(resp['ycord'], '41.704032')
		self.assertEqual(resp['adds'], '0')

	def test_places_put_key(self):
		#self.reset_data()
		place_id = 95

		r = requests.get(self.PLACES_URL + str(place_id))
		self.assertTrue(self.is_json(r.content.decode('utf-8')))
		resp = json.loads(r.content.decode('utf-8'))
		self.assertEqual(resp['name'], 'Duncan Hall')
		self.assertEqual(resp['xcord'], '-86.24299')
		self.assertEqual(resp['ycord'], '41.698225')
		self.assertEqual(resp['adds'], '0')
	
		m = {}
		m['name'] = 'Parking Lot 55'
		m['xcord'] = '80.9'
		m['ycord'] = '60.5'
		m['adds'] = '0'
		m['reviews'] = 'Good place'
		r = requests.put(self.PLACES_URL + str(place_id), data = json.dumps(m))
		self.assertTrue(self.is_json(r.content.decode('utf-8')))
		resp = json.loads(r.content.decode('utf-8'))
		self.assertEqual(resp['result'], 'success')
        
		p = int(m['adds'])
		p += 1
		m['adds'] = str(p)
		r = requests.get(self.PLACES_URL + str(place_id))
		self.assertTrue(self.is_json(r.content.decode('utf-8')))
		resp = json.loads(r.content.decode('utf-8'))
		self.assertEqual(resp['name'], m['name'])
		self.assertEqual(resp['xcord'], m['xcord'])
		self.assertEqual(resp['ycord'], m['ycord'])
		self.assertEqual(resp['adds'], m['adds'])

if __name__ == "__main__":
	unittest.main()

