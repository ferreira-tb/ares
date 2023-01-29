from json import JSONDecodeError
from threading import Timer
from aiohttp import web
from aiohttp.web import json_response
from sqlalchemy.exc import IntegrityError, InvalidRequestError
from dotenv import load_dotenv
from model import get_deimos, save_reports
from helpers import get_app_port, quit_app
from error import save_error_log, save_dom_error_log
from error import get_error_logs, get_dom_logs, get_all_error_logs

load_dotenv()

app = web.Application()
routes = web.RouteTableDef()


@routes.get('/deimos')
async def go_away(request):
    return web.Response(status=403, text='Você não deveria estar aqui.')


# Finaliza a aplicação.
@routes.get('/deimos/quit')
async def ungracefully_quit_app(request):
    Timer(3, quit_app).start()
    return web.Response(status=200, text='Encerrando...')


# Obtêm informações sobre todos os erros registrados no banco de dados.
@routes.get('/deimos/error/all')
async def get_all_errors(request):
    try:
        all_errors_list = get_all_error_logs()
        return json_response(all_errors_list, status=200)
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


# Obtêm informações sobre os erros comuns registrados no banco de dados.
@routes.get('/deimos/error/normal')
async def get_errors(request):
    try:
        error_list = get_error_logs()
        return json_response(error_list, status=200)
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


# Salva informações sobre erros comuns.
@routes.post('/deimos/error/normal')
async def handle_error_log(request: web.Request):
    try:
        error_log = await request.json()
        save_error_log(error_log)
        return web.Response(status=201, text='Operação bem sucedida.')
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


# Obtêm informações sobre os erros relacionados ao DOM registrados no banco de dados.
@routes.get('/deimos/error/dom')
async def get_dom_errors(request):
    try:
        dom_error_list = get_dom_logs()
        return json_response(dom_error_list, status=200)
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


# Salva informações sobre erros relacionados ao DOM.
@routes.post('/deimos/error/dom')
async def handle_dom_error_log(request: web.Request):
    try:
        error_log = await request.json()
        save_dom_error_log(error_log)
        return web.Response(status=201, text='Operação bem sucedida.')
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


# Salva informações sobre ataques no banco de dados do Deimos.
@routes.post('/deimos/save/plunder')
async def save_plunder_reports(request: web.Request):
    try:
        reports = await request.json()
        save_reports(reports)
        return web.Response(status=201, text='Operação bem sucedida.')
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


# Faz uma previsão usando o Deimos.
@routes.post('/deimos/predict/plunder/{world}')
async def predict_resources(request: web.Request):
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
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))


app.add_routes(routes)
web.run_app(app, host="127.0.0.1", port=get_app_port())
