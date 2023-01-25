import sys
from routes import routes
from aiohttp import web

# sys.argv
# 1 - Porta usada pela aplicação.
# 2 - Caminho para o diretório padrão usado pelo Electron.

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