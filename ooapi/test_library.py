from place_library import _place_database

if __name__ == "__main__":
	ndp = _place_database()
	ndp.load_places('../server/ndplaces.json')

	print("***Test get_place() - index=234***")
	print(ndp.get_place(234))
	print()

	print("***Test set_place() - name=Death Valley, xcord=50, ycord=60***")
	place = ndp.get_place(23)
	place[0] = 'Death Valley'
	place[1] = '50'
	place[2] = '60'
	ndp.set_place(234, place)
	print(ndp.get_place(234))
	print()

	print("***Test update_place() - review=Good place***")
	ndp.update_place(234, ["Good place"])
	print(ndp.get_place(234))
	print()

	print("***Test incr_adds()***")
	ndp.incr_adds(234)
	print(ndp.get_place(234))
	print()



