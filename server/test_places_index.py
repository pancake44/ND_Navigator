import unittest
import requests
import json

class TestMoviesIndex(unittest.TestCase):

	SITE_URL = 'http://localhost:51040' # replace with your assigned port id
	print("Testing for server: " + SITE_URL)
	PLACES_URL = SITE_URL + '/places/'

	def is_json(self, resp):
		try:
			json.loads(resp)
			return True
		except ValueError:
			return False
	
	def test_places_index_get(self):
		#self.reset_data()
		r = requests.get(self.PLACES_URL)
		self.assertTrue(self.is_json(r.content.decode()))
		resp = json.loads(r.content.decode())

		testplace = {}
		places = resp['places']
		for place in places:
			if place['id'] == 32:
				testplace = place
		self.assertEqual(testplace['name'], 'Brownson Hall')
		self.assertEqual(testplace['xcord'], '-86.239368')
		self.assertEqual(testplace['ycord'], '41.704032')
		self.assertEqual(testplace['adds'], '0')

	def test_places_index_post(self):
		#self.reset_data()
		m = {}
		m['name'] = 'Stadium'
		m['xcord'] = '25.6'
		m['ycord'] = '30.3'
		m['adds'] = '0'
		r = requests.post(self.PLACES_URL, data = json.dumps(m))
		self.assertTrue(self.is_json(r.content.decode()))
		resp = json.loads(r.content.decode())
		self.assertEqual(resp['result'], 'success')
		self.assertEqual(resp['id'], 583)

		r = requests.get(self.PLACES_URL + str(resp['id']))
		self.assertTrue(self.is_json(r.content.decode()))
		resp = json.loads(r.content.decode())
		self.assertEqual(resp['name'], m['name'])
		self.assertEqual(resp['xcord'], m['xcord'])
		self.assertEqual(resp['ycord'], m['ycord'])
		self.assertEqual(resp['adds'], '0')

if __name__ == "__main__":
	unittest.main()

