from globals import *
import json
from bottle import route, get, post, delete, request
from chef import *
from services.razor_api import razor_api
from controllers.microwave_controller import get_remote_chef_api
from services.server_helper import *

#TODO: more than one razor???
razor_api = razor_api(config['razor']['ip'])


######################
##  RAZOR API REQUESTS
######################
@post('/destroy_nodes/:chef_server')
def destroy_razor_nodes(chef_server):
    if request.json is None:
        return {'error': 'Not valid json'}
    else:
        remote_chef = get_remote_chef_api(chef_server)
        for node_name in request.json['destroy']:
            #get node information
            chef_node = Node(node_name, api=remote_chef)
            chef_client = Client(node_name, api=remote_chef)
            am_uuid = chef_node['razor_metadata'].to_dict()['razor_active_model_uuid']
            ip = chef_node['ipaddress']
            root_pass = razor_api.get_active_model_pass(am_uuid)['password']

            #reboot box
            run = run_remote_ssh_cmd(ip, 'root', root_pass, "reboot 0")
            if not run['success']:
                return {'error': 'Could not reboot server'}
            else:
                #if successfully rebooted box
                #delete chef node/client
                chef_client.delete()
                chef_node.delete()

                #delete active model
                razor_api.remove_active_model(am_uuid)
                print "Destroyed node: %s" % node_name

        return {'status': 'success'}


@route('/razor/active_models')
def razor_models():
    return razor_api.active_models()


@delete('/razor/active_model/:am_uuid')
def delete_razor_am(am_uuid):
    if request.json is None:
        return {'error': 'Not valid json'}
    else:
        try:
            ip = None
            delete_data = json.loads(request.body.read())
            if 'ip' in delete_data:
                ip = delete_data['ip']
            razor_api.delete_active_model(am_uuid, ip=ip, reboot=True)
        except Exception, e:
            return {'error': str(e)}
