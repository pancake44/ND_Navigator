# Group Members: Gerry Fernandez (gfernan2), Harrison Snow (hsnow)
# Available ports: 51038, 51040
import cherrypy
#import sys
import sys
import pathlib
from placesController import PlaceController
sys.path.append(str(pathlib.Path(__file__).parent.absolute()) + '/../ooapi/')
from place_library import _place_database

def start_service():
	dispatcher = cherrypy.dispatch.RoutesDispatcher()

	ndp = _place_database()

	placeController = PlaceController(ndp=ndp)

	dispatcher.connect('place_get', '/places/:place_id', controller=placeController, action = 'GET_KEY', conditions=dict(method=['GET']))
	dispatcher.connect('place_put', '/places/:place_id', controller=placeController, action = 'PUT_KEY', conditions=dict(method=['PUT']))
	dispatcher.connect('place_index_get', '/places/', controller=placeController, action = 'GET_INDEX', conditions=dict(method=['GET']))
	dispatcher.connect('place_index_post', '/places/', controller=placeController, action = 'POST_INDEX', conditions=dict(method=['POST']))

	conf = {
	'global': {
		'server.thread_pool': 5, # optional argument
		'server.socket_host': 'localhost', # 
		'server.socket_port': 51040, #change port number to your assigned
			},
	'/': {
		'request.dispatch': dispatcher,
		}
	}
	
	cherrypy.config.update(conf)
	app = cherrypy.tree.mount(None, config=conf)
	cherrypy.quickstart(app)

# end of start_service


if __name__ == '__main__':
	start_service()

