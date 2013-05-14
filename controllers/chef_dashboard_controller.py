from bottle import route, error, response, template, post, request
from chef import *
import json
chef = autoconfigure()


@route('/', template='home')
def home():
    return {}



@route('/dashboard', template='dashboard')
def dashboard():
    envs = [str(e) for e in Environment.list()]
    envs.sort()    
    return { 'nodes' : [str(n) for n in Node.list()],
             'environments': envs }



@post('/node')
def node():
    try:
        if request.json is None:
            return {'error': 'No json provided'}      
        if 'name' not in request.json:
            return {'error': 'No name provided'}
        
        name = request.json['name']
        nodes = Search('node').query('name:%s' % name)
        
        return {'node': [node for node in nodes] }

        
        
         
    except Exception, e:
        return {'error': str(e) } 
    

    


@route('/about', template='about')
def about_view():
    return {}

