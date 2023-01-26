import os
import signal
from aiohttp import web
from dotenv import load_dotenv
from deimos import deimos
from helpers import get_app_port

load_dotenv()

app_name = 'ares'
routes = web.RouteTableDef()


@routes.get(f'/{app_name}')
async def get_home(request):
    return web.Response(text='Você não deveria estar aqui.')


@routes.get(f'/{app_name}/predict')
async def predict(request):
    prediction = int(deimos.predict([558, 300, 23336, 27345, 27])[0])
    return web.Response(text=str(prediction))


# Finaliza a aplicação.
@routes.get(f'/{app_name}/quit')
async def quit_app(request):
    pid = os.getpid()
    os.kill(pid, signal.SIGINT)
    return web.Response(text='Encerrando...')


app = web.Application()
app.add_routes(routes)

web.run_app(app, host="127.0.0.1", port=get_app_port())
