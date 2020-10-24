import json
import pathlib

class _place_database:
	
	def __init__(self):
		self.place_names = dict()
		self.place_xcords = dict()
		self.place_ycords = dict()
		self.place_adds = dict()
		self.place_reviews = dict()

	def load_places(self, place_file):
		with open(str(pathlib.Path(__file__).parent.absolute()) + '/../server/ndplaces.json') as f:
			data = json.load(f)

		plid = 0
		for place in data:
			#plid = int(data['id']) 

			self.place_names[plid] = str(place['name'])
			self.place_xcords[plid] = str(place['midpoint']['max_long'])
			self.place_ycords[plid] = str(place['midpoint']['max_lat'])
			self.place_adds[plid] = str(place['adds'])
			self.place_reviews[plid] = []
			plid += 1

	def get_places(self):
		return self.place_names.keys()

	def get_place(self, plid):
		try:
			mname = self.place_names[plid]
			mxcord = self.place_xcords[plid]
			mycord = self.place_ycords[plid]
			madds = self.place_adds[plid]
			mreviews = self.place_reviews[plid]
			place = list((mname, mxcord, mycord, madds, mreviews))
		except Exception as ex:
			print(str(ex))
			place = None

		return place

	def set_place(self, plid, place):
		self.place_names[plid] = place[0]
		self.place_xcords[plid] = place[1]
		self.place_ycords[plid] = place[2]
		self.place_adds[plid] = '0'
		# if new place, set reviews to empty list
		if plid not in self.place_reviews:
			self.place_reviews[plid] = []

	def update_place(self, plid, review):
		self.place_reviews[plid].append(review)

	# increment adds
	def incr_adds(self, plid):
		#self.place_adds[plid] += 1
		p = int(self.place_adds[plid])
		p += 1
		self.place_adds[plid] = str(p)

