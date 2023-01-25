import os
import signal
from aiohttp import web
from json import JSONEncoder
from deimos.plunder import plunder

routes = web.RouteTableDef()
prefix = 'ares'

@routes.get(f'/{prefix}')
async def get_home(request):
    return web.Response(text='Você não deveria estar aqui.')

@routes.get(f'/{prefix}/predict')
async def predict(request):
    prediction = plunder.predict([[558, 300, 23336, 27345, 27]])
    result = int(prediction[0])
    return web.Response(text=JSONEncoder().encode(result))

# Finaliza a aplicação.
@routes.get(f'/{prefix}/quit')
async def quit_app(request):
    pid = os.getpid()
    os.kill(pid, signal.SIGINT)
    return web.Response(text='Encerrando...')