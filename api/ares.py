from json import JSONDecodeError
from threading import Timer
from aiohttp import web
from dotenv import load_dotenv
from deimos import get_deimos
from helpers import get_app_port, quit_app

load_dotenv()

app = web.Application()
routes = web.RouteTableDef()


@routes.get('/ares')
async def go_away(request):
    return web.Response(status=403, text='Você não deveria estar aqui.')


# Finaliza a aplicação.
@routes.get('/ares/quit')
async def ungracefully_quit_app(request):
    Timer(2, quit_app).start()
    return web.Response(status=200, text='Encerrando...')


# Salva informações sobre ataques no banco de dados do Deimos.
@routes.post('/deimos/save/{world}')
async def deimos_save(request: web.Request):
    world = request.match_info['world']
    if type(world) is not str:
        return web.Response(status=400, text='Mundo inválido.')

    try:
        reports = await request.json()
        deimos = get_deimos(world)
        deimos.save(reports)
        return web.Response(status=201, text='Operação bem sucedida.')
    except JSONDecodeError:
        return web.Response(status=400, text='Erro ao decodificar o JSON.')
    except TypeError:
        return web.Response(status=400, text='Parâmetros inválidos.')
    

# Faz uma previsão usando o Deimos.
@routes.post('/deimos/predict/{world}')
async def deimos_predict(request: web.Request):
    world = request.match_info['world']
    if type(world) is not str:
        return web.Response(status=400, text='Mundo inválido.')
    
    deimos = get_deimos(world)
    if deimos.ready is False:
        return web.Response(status=418, text='Ainda não há dados o suficiente para a predição.')

    try:
        features = await request.json()
        prediction = deimos.predict(features)
        return web.Response(status=200, text=str(prediction))
    except JSONDecodeError:
        return web.Response(status=400, text='Erro ao decodificar o JSON.')
    except TypeError:
        return web.Response(status=400, text='Parâmetros inválidos.')


app.add_routes(routes)
web.run_app(app, host="127.0.0.1", port=get_app_port())
