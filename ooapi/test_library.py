from place_library import _place_database

if __name__ == "__main__":
	ndp = _place_database()
	ndp.load_places('../server/ndplaces.json')

	print("***Test get_place() - index=234***")
	print(ndp.get_place(234))
	print()

	print("***Test set_place() - name=Death Valley, xcord=50, ycord=60***")
	place = list()
	place.append('Death Valley')
	place.append('50')
	place.append('60')
	place.append('0')
	place.append(None)
	ndp.set_place(234, place)
	print(ndp.get_place(234))
	print()

	print("***Test update_place() - review=Good place***")
	place[4] = 'Good place'
	ndp.set_place(234, place)
	print(ndp.get_place(234))
	print()

	print("***Test incr_adds()***")
	ndp.incr_adds(234)
	print(ndp.get_place(234))
	print()



