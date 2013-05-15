import json

def get_json(data, expected_keys=[]):
    if data is None: 
        return {'error': 'no data'}
    
    try:
        json_data = json.loads(data)
    except Exception, e:
        return {'error': 'not valid json: %s' % data}
    
    for key in expected_keys:
        if key not in json_data.keys():
            return {'error': 'Missing a key from: %s' % expected_keys}
            
    return json_data