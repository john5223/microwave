import json, os
from bottle import route, error, response, template, post, request, get, delete
from chef import *
from services.chef_service import *
from services import misc
from globals import *


default_chef_api = autoconfigure()
if default_chef_api is None:
    print "Need to have at least default chef configured in ~/.chef"
    sys.exit(1)

remote_chef_dir = os.path.expanduser(config['chef']['remote-chef-clients'])

#################
## HTML
#################
@route('/', template='home')
def home():
    remote_chefs = []
    if os.path.exists(remote_chef_dir):
        remote_chefs = os.listdir(remote_chef_dir)
    return {'remote_chefs': remote_chefs }


@route('/about', template='about')
def about_view():
    return {}


@get('/dashboard', template='dashboard')
def dashboard_default():
    return dashboard("default")


@get('/dashboard/:chef_server', template='dashboard')
def dashboard(chef_server):
    remote_chefs = []
    if os.path.exists(remote_chef_dir):
        remote_chefs = os.listdir(remote_chef_dir)
    if chef_server in remote_chefs + ['default']:
        return {'chef_server': chef_server}
    else:
        return {'error': 'No remote chef found: %s' % chef_server}



###########################
## CHEF API REQUESTS
###########################

def get_remote_chef_api(chef_server="default"):
    if (chef_server == "default"):
        return default_chef_api
    else:
        kniferb_path = "%s/%s/.chef/knife.rb" % (remote_chef_dir, chef_server)
        remote_chef_api = ChefAPI.from_config_file(path=kniferb_path)
        return remote_chef_api


################
# Environments

#default environment list
@get('/environments')
def environment_list(chef_api=default_chef_api):
    return {'environments': [e for e in Environment.list(api=chef_api)]}


#remote chef environment list
@get('/environments/:chef_server')
def environment_list_remote(chef_server):
    remote_chef_api = get_remote_chef_api(chef_server)
    if remote_chef_api is None:
        return {'error': 'Can\'t open up chef server: %s' % chef_server}
    return environment_list(chef_api=remote_chef_api)


#get nodes and other actions
@post('/environments/:chef_server')
def environment(chef_server):
    try:
        if request.json is None:
            raise Exception("Not valid json")
        else:
            if 'names' in request.json:
                remote_chef_api = get_remote_chef_api(chef_server)
                if remote_chef_api is None:
                    return {'error': 'Couldn\'t open that environment (permission issues?)'}
                return get_environment_nodes_and_other_nodes(request.json['names'], chef_api=remote_chef_api)
    except Exception, e:
        import traceback
        print traceback.format_exc()
        print e
        return {'error': str(e)}


#Only allowed actions are add / delete
@post('/environment/:chef_server/:action')
def environment_action(chef_server, action):
    try:
        if request.json is None:
            raise Exception("Not valid json")
        else:
            print "%s: %s" % (action, names)
            if action == "add":
                for env in request.json:
                    print "Added env: %s" % env
                    Environment.create(env)
            elif action == "delete":
                for env in request.json:
                    print "deleting %s" % env
                    e = Environment(env)
                    e.delete()
            elif action == "update":
                raise Exception("Need to implement!")
            else:
                return {'error': 'Action %s is not implemented' % action}

            return {'status': 'success'}
    except Exception, e:
        return {'error': str(e)}
        print e






################
# Nodes

@get('/nodes')
def nodes_list(chef_api=default_chef_api):
    return {'nodes': [e for e in Node.list(api=chef_api)]}


#remote chef environment list
@get('/nodes/:chef_server')
def nodes_list_remote(chef_server):
    remote_chef_api = get_remote_chef_api(chef_server)
    if remote_chef_api is None:
        return {'error': 'Can\'t open up chef server: %s' % chef_server}
    return nodes_list(chef_api=remote_chef_api)


@post('/nodes/:chef_server')
def node_info(chef_server):
    try:
        if request.json is None:
            raise Exception("Not valid json")
        else:
            if 'names' in request.json:
                remote_chef_api = get_remote_chef_api(chef_server)
                if remote_chef_api is None:
                    return {'error': 'Couldn\'t open that environment (permission issues?)'}

                names = request.json['names'].split(",")
                if not set(names).issubset(set([n for n in Node.list(api=remote_chef_api)])):
                    return {'error': 'One or more nodes with invalid names: %s ' % json_data['name']}
                ret = {}
                for name in names:
                    node = Node(name, api=remote_chef_api)
                    ret[name] = {'run_list': node.run_list,
                                 'attributes': node.attributes.to_dict()}
                return ret
    except Exception, e:
        import traceback
        print traceback.format_exc()
        print e
        return {'error': str(e)}






################
# Roles

#default environment list
@get('/roles')
def roles_list(chef_api=default_chef_api):
    roles = [e for e in Role.list(api=chef_api)]
    roles.sort()
    return {'roles': roles}


#remote chef environment list
@get('/roles/:chef_server')
def roles_list_remote(chef_server):
    remote_chef_api = get_remote_chef_api(chef_server)
    if remote_chef_api is None:
        return {'error': 'Can\'t open up chef server: %s' % chef_server}
    return roles_list(chef_api=remote_chef_api)


@post('/roles/:chef_server')
def roles_info(chef_server):
    try:
        if request.json is None:
            raise Exception("Not valid json")
        else:
            if 'names' in request.json:
                remote_chef_api = get_remote_chef_api(chef_server)
                if remote_chef_api is None:
                    return {'error': 'Couldn\'t open that environment (permission issues?)'}

                query = ""
                if request.json['names'] == "ALL":
                    roles = [role for role in Search('role', api=remote_chef_api)]
                else:
                    names = request.json['names'].split(',')
                    query = ["name:%s" % name for name in names]
                    query = " OR ".join(query)
                    roles = [role for role in Search('role', api=remote_chef_api).query(query)]
                
                return {'roles': roles}

    except Exception, e:
        import traceback
        print traceback.format_exc()
        print e
        return {'error': str(e)}







################
# Cookbooks


#default environment list
@get('/cookbooks')
def cookbooks_list(chef_api=default_chef_api):
    return {'cookbooks': chef_api.api_request('GET', '/cookbooks')}


#remote chef environment list
@get('/cookbooks/:chef_server')
def cookbooks_list_remote(chef_server):
    remote_chef_api = get_remote_chef_api(chef_server)
    if remote_chef_api is None:
        return {'error': 'Can\'t open up chef server: %s' % chef_server}
    return cookbooks_list(chef_api=remote_chef_api)


@get('/cookbooks/:chef_server/:cookbook')
def cookbook_name(chef_server, cookbook):
    remote_chef_api = get_remote_chef_api(chef_server)
    if remote_chef_api is None:
        return {'error': 'Can\'t open up chef server: %s' % chef_server}
    cookbook_info = remote_chef_api.api_request('GET', '/cookbooks/%s' % cookbook)
    #versions = [v['version'] for v in cookbook_info[name]['versions']]
    return cookbook_info


@get('/cookbooks/:chef_server/:cookbook/:version')
def cookbook_name_version(chef_server, cookbook, version):
    remote_chef_api = get_remote_chef_api(chef_server)
    if remote_chef_api is None:
        return {'error': 'Can\'t open up chef server: %s' % chef_server}
    return {cookbook: remote_chef_api.api_request('GET', '/cookbooks/%s/%s' % (cookbook, version))}







@post('/move_nodes')
def move_nodes():
    json_data = misc.get_json(request.body.read(), expected_keys=['nodes', 'environment'])
    environment = json_data['environment']
    #if enviornment exists
    if len(Search('environment').query('name:%s' % environment)) > 0:
        for n in json_data['nodes']:
            node = Node(n)
            print "Changing %s to env %s" % (node.name, environment)
            node.chef_environment = environment
            node.save()
    return {'status': 'Success'}








