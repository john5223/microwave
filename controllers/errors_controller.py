from bottle import error, template, route

@error(404)
def error404(error):
    return template('errors/404')

@error(500)
@route('/error')
def error500(error):
    return template('errors/500')
