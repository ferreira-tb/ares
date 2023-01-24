import os
import signal
from aiohttp import web

routes = web.RouteTableDef()
prefix = 'phobia'

@routes.get(f'/{prefix}')
async def get_home(request):
    return web.Response(text='Você não deveria estar aqui.')

@routes.get(f'/{prefix}/quit')
async def quit_app(request):
    pid = os.getpid()
    os.kill(pid, signal.SIGINT)
    return web.Response(text='Encerrando...')