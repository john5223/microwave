import json
from bottle import route, get, post, delete, request
from services.razor_api import razor_api
from globals import *

#TODO: more than one razor???
razor_api = razor_api(config['razor']['ip'])


######################
##  RAZOR API REQUESTS
######################
@route('/razor/active_models')
def razor_models():
    return razor_api.active_models()


@delete('/razor/active_model/:am_uuid')
def delete_razor_am(am_uuid):
    try:
        ip = None
        delete_data = json.loads(request.body.read())
        if 'ip' in delete_data:
            ip = delete_data['ip']
        razor_api.delete_active_model(am_uuid, ip=ip, reboot=True)
    except Exception, e:
        return {'error': str(e)}


