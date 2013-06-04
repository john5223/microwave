from chef import *
default_chef_api = autoconfigure()


###########################
## CHEF Functions
###########################
def get_environment_nodes_and_other_nodes(names="ALL", chef_api=default_chef_api):
    names = names.split(",")
    if not set(names).issubset(set([n for n in Environment.list(api=chef_api)]+["ALL"])):
        return {'error': 'One or more invalid environments given: %s' % names}
    container_nodes = {}
    other_nodes = {}
    for name in names:
        if name != "ALL":
            container_nodes[name] = []
    for node in Search('node', api=chef_api):
        env = node['chef_environment']
        if env in names or "ALL" in names:
            if env not in container_nodes:
                container_nodes[env] = []
            container_nodes[env].append(node['name'])
        else:
            if env not in other_nodes:
                other_nodes[env] = []
            other_nodes[env].append(node['name'])
    environments = {}
    if "ALL" not in names:
        query = ""
        for name in names:
            query += "name:%s OR " % name
        query = query[:-4]
        environments = {}
        for env in Search('environment', api=chef_api).query(query):
            if env['name'] not in environments:
                environments[env['name']] = env
    elif "ALL" in names:
        for env in Search('environment', api=chef_api):
            environments[env['name']] = env

    return {'environments': environments,
            'nodes': container_nodes,
            'other_nodes': other_nodes}
