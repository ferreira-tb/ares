# pyinstaller api/ares.py --onefile --specpath __testpy__ --distpath __testpy__ --workpath __testpy__
import sys
from routes import routes
from aiohttp import web

app = web.Application()
app.add_routes(routes)

def set_port():
    ''' Define a porta que será usada pela aplicação. '''
    try:
        port = int(sys.argv[1])
        return port
    except IndexError:
        return 8000

web.run_app(app, host="127.0.0.1", port=set_port())