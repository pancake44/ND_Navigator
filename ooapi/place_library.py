import json
import pathlib

class _place_database:
	
	def __init__(self):
		self.place_names = dict()
		self.place_xcords = dict()
		self.place_ycords = dict()
		self.place_adds = dict()
		self.place_reviews = dict()
		self.place_descriptions = dict()

	# reads in the place data from the ndplaces.json file and stores in dicts in the database
	def load_places(self, place_file):
		with open(str(pathlib.Path(__file__).parent.absolute()) + '/../server/ndplaces.json') as f:
			data = json.load(f)

		plid = 0
		for place in data:
			self.place_names[plid] = str(place['name'])
			self.place_xcords[plid] = str(place['midpoint']['max_long'])
			self.place_ycords[plid] = str(place['midpoint']['max_lat'])
			self.place_adds[plid] = str(place['adds'])
			self.place_reviews[plid] = []
			self.place_descriptions[plid] = str(place['description'])
			plid += 1

	def get_places(self):
		return self.place_names.keys()

	# returns data for a given plid
	def get_place(self, plid):
		try:
			mname = self.place_names[plid]
			mxcord = self.place_xcords[plid]
			mycord = self.place_ycords[plid]
			madds = self.place_adds[plid]
			mreviews = self.place_reviews[plid]
			mdescriptions = self.place_descriptions[plid]
			place = list((mname, mxcord, mycord, madds, mreviews, mdescriptions))
		except Exception as ex:
			place = None

		return place

	# modify data for a given place's plid
	def set_place(self, plid, place):
		self.place_names[plid] = place[0]
		self.place_xcords[plid] = place[1]
		self.place_ycords[plid] = place[2]
		self.place_adds[plid] = place[3] 
		# if new place, set reviews to empty list
		if plid not in self.place_reviews:
			self.place_reviews[plid] = []

		if place[4] is not None:
			self.place_reviews[plid].append(place[4])

		self.place_descriptions[plid] = place[5]		

	# increment adds
	# adds is used as a "vistor count" to keep track of how many times vistors have visited a place
	def incr_adds(self, plid):
		p = int(self.place_adds[plid])
		p += 1
		self.place_adds[plid] = str(p)

	def add_review(self, plid, review):
		self.place_reviews[plid].append(review)
