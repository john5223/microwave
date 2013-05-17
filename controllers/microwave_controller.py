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
             'roles': Role.list(),
             'cookbooks':  chef_api.api_request('GET','/cookbooks'), #TODO: build this into pychef
             'environments': environment_list()['list'] }


@route('/cookbooks')
def cookbooks_list():
    return { 'cookbooks':  chef_api.api_request('GET','/cookbooks') }

@route('/cookbooks/:name')
def cookbook_name(name):
    cookbook_info = chef_api.api_request('GET','/cookbooks/%s' % name)    
    #versions = [v['version'] for v in cookbook_info[name]['versions']]    
    return cookbook_info

@route('/cookbooks/:name/:version')
def cookbook_name(name, version):
    return { name: chef_api.api_request('GET','/cookbooks/%s/%s' % (name,version)) }




@route('/node/list')
def node_list():
    return { 'list': [n for n in Node.list()] }

@post('/node')
def node():
    json_data = misc.get_json(request.body.read(), expected_keys=['name'])    
    if 'error' not in json_data:
        names = json_data['name'].split(",")
        if not set(names).issubset(set([n for n in Node.list()])):
            return {'error': 'One or more nodes with invalid names: %s ' % json_data['name']}
        
        ret = {}        
        for name in names:
            node = Node(name)
            ret[name] = { 'attributes': node.attributes.to_dict() }       
        return ret
    else: 
        return json_data #returns the error from get_json
 

 

@route('/environment/list')
def environment_list():
    return { 'list': [e for e in Environment.list()] }
           
@post('/environment')
def environment():
    json_data = misc.get_json(request.body.read(), expected_keys=['name'])    
    if 'error' in json_data:
        return json_data #returns the error from get_json    
    elif 'error' not in json_data:
        names = json_data['name'].split(",")
        if not set(names).issubset(set([n for n in Environment.list()]+["ALL"])):
            return {'error': 'One or more invalid environments given: %s' % json_data['name']}
        
        #Get query to find all environments in post
        query = ""
        if "ALL" in names:
            query = "name:*"
        else:                
            for name in names: query += "name:%s OR " % name
            query = query[:-4]
        
        #Find the nodes for the environments requested
        environments = [e for e in Search('environment').query(query)]
        nodes = {}

        for env in environments:
            env_name = env['name']
            if env_name not in nodes:
                nodes[env_name] = []
            nodes[env_name].extend([node['name'] for node in Search('node').query("chef_environment:%s" % env['name'] )])
        
        #Find the nodes not belonging to the one or more environments given in the request             
        other_nodes = {}
        query = query.replace("name:","NOT chef_environment:").replace("OR","")        
        for node in Search('node').query(query):
            if node['chef_environment'] not in other_nodes:
                other_nodes[node['chef_environment']] = []
            other_nodes[node['chef_environment']].append(node['name'])
        
        return {'environments': environments,
                'nodes': nodes,
                'other_nodes': other_nodes }





@route('/about', template='about')
def about_view():
    return {}

