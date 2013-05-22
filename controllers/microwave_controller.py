from chef import *

from bottle import route, error, response, template, post, request,get
from services import misc
import json

#TODO: make it manage more than one chef
chef_api = autoconfigure()




@route('/', template='home')
def home():
    return {}


@post('/move_nodes')
def move_nodes():
    json_data = misc.get_json(request.body.read(), expected_keys=['nodes','environment'])
    environment = json_data['environment']
    #if enviornment exists
    if len(Search('environment').query('name:%s' % environment)) > 0:
        for n in json_data['nodes']:
            node = Node(n)
            print "Changing %s to env %s" % (node.name, environment)
            node.chef_environment = environment   
            node.save()
    return { 'status': 'Success' }


@route('/dashboard', template='dashboard')
def dashboard():  
    roles = [r for r in Role.list()]
    roles.sort()
    
    cookbooks = [c for c in chef_api.api_request('GET','/cookbooks')]
    cookbooks.sort()
    return { 'nodes' : get_environment_nodes(),
             'roles': roles,
             'cookbooks':  cookbooks, #TODO: build this into pychef
             'environments': environment_list()['list'] }


@post('/roles')
def roles_info():
    json_data = misc.get_json(request.body.read(), expected_keys=['name'])    
    if 'error' in json_data:
        return error
    else:
        names = json_data['name'].split(',')
        query = ["name:%s" % name for name in names]
        query = " OR ".join(query)
        roles = [role for role in Search('role').query(query)]
        return {'roles': roles }

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
            ret[name] = { 'run_list': node.run_list,
                         'attributes': node.attributes.to_dict() }       
        return ret
    else: 
        return json_data #returns the error from get_json
 

def get_environment_nodes(names=["ALL"]):
        if not set(names).issubset(set([n for n in Environment.list()]+["ALL"])):
            return {'error': 'One or more invalid environments given: %s' % names}                
        container_nodes = {}
        for name in names: 
            if name != "ALL": container_nodes[name] = []
        other_nodes = {}
        
        search_nodes = Search('node')
        for node in search_nodes:
            env = node['chef_environment']
            if env in names or "ALL" in names:
                if env not in container_nodes: container_nodes[env] = []
                container_nodes[env].append(node['name'])
            else:
                if env not in other_nodes: other_nodes[env] = []
                other_nodes[env].append(node['name'])     
        
        if "ALL" in names:
            environments = {}
        else:
            query = ""
            for name in names: query += "name:%s OR " % name
            query = query[:-4]
            environments = {}
            for env in Search('environment').query(query):
                if env['name'] not in environments:
                    environments[env['name']] = env
            
            
        return { 'environments': environments, 
                 'nodes': container_nodes,
                 'other_nodes': other_nodes } 
        
        

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
        return get_environment_nodes(names)


#Only allowed actions are add / delete
@post('/environment/:action')
def environment(action):
    json_data = misc.get_json(request.body.read(), expected_keys=['name'])    
    if 'error' in json_data:
        return json_data #returns the error from get_json    
    elif 'error' not in json_data:
        names = json_data['name'].split(",")
        return environments_action(action, names)


def environments_action(action, names):
    print "%s: %s" % (action, names)
    if action == "add":
        for env in names:
            print "Added env: %s" % env
            Environment.create(env)                
    elif action == "delete":
        for env in names:
            print "deleting %s" % env
            e = Environment(env)
            e.delete()           
    return {}






@route('/about', template='about')
def about_view():
    return {}

