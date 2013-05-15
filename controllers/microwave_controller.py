from chef import *

from bottle import route, error, response, template, post, request
from services import misc
import json



#TODO: make it manage more than one chef
chef_api = autoconfigure()

@route('/', template='home')
def home():
    return {}


@route('/dashboard', template='dashboard')
def dashboard():  
    return { 'nodes' : node_list()['list'],
             'cookbooks':  chef_api.api_request('GET','/cookbooks'), #TODO: build this into pychef
             'environments': environment_list()['list'] }




@route('/environment/list')
def environment_list():
    return { 'list': [e for e in Environment.list()] }

@route('/node/list')
def node_list():
    return { 'list': [n for n in Node.list()] }


@post('/node')
def node():
    json_data = misc.get_json(request.body.read(), expected_keys=['name'])    
    if 'error' not in json_data:
        names = json_data['name'].split(",")
        if not set(names).issubset(set([n for n in Node.list()])):
            return {'error': 'No nodes with that name'}
        
        ret = {}        
        for name in names:
            node = Node(name)
            ret[name] = { 'attributes': node.attributes.to_dict() }       
        return ret
    else: 
        return json_data #returns the error from get_json
        
            


@route('/about', template='about')
def about_view():
    return {}

