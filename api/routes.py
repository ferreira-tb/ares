import os
import signal
from aiohttp import web

routes = web.RouteTableDef()

@routes.get('/')
async def get_home(request):
    return web.Response(text='Você não deveria estar aqui.')

@routes.get('/quit')
async def quit_app(request):
    pid = os.getpid()
    os.kill(pid, signal.SIGINT)
    return web.Response(text='Encerrando...')