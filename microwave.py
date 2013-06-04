from gevent import monkey; monkey.patch_all()
import bottle, os, sys, re, yaml, json
import globals

#===============================================================================
# The following class is used to strip the trailing slash from the request path
class StripPathMiddleware(object):
  def __init__(self, app):
    self.app = app
  def __call__(self, e, h):
    e['PATH_INFO'] = e['PATH_INFO'].rstrip('/')
    return self.app(e,h)

#===============================================================================
# Load the application path
load_dir = os.path.dirname(os.path.realpath(__file__))
sys.path = [load_dir] + sys.path
os.chdir(load_dir)
app_base = os.path.dirname(os.path.realpath(__file__))
app_base_join = lambda x: os.path.join(os.sep, app_base, x)

#Get config
configs = yaml.load(open(app_base_join('conf' + os.sep + "microwave.yaml")))
config = {}
env = configs['environment']
for key, val in configs.iteritems():
    if key == 'environment': config.update({key: val})
    else: config.update({key: val[env]})
globals.config = config

#===============================================================================
#Import windfall structure
control_dirs = ['controllers']
[sys.path.append(dir) for dir in control_dirs]
[__import__(file[:-3]) 
 for cdir in control_dirs 
 for file in os.listdir(app_base_join(cdir))
   if re.match('.*_' + cdir[:-1] + '.py$', file)]


if __name__ == '__main__':
    #===============================================================================
    # Run localhost for dev
    bottle.debug(True)
    app = bottle.app()
    myapp = StripPathMiddleware(app)
    bottle.run(app=myapp, host='localhost', port='8080', server='gevent')
else:
    #===============================================================================
    # Mod WSGI launch
    print "#" * 71; print "    MICROWAVE   "; print "#" * 71
    application = bottle.default_app()
    application = StripPathMiddleware(application)