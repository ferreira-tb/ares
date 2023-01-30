from json import JSONDecodeError
from threading import Timer
from aiohttp import web
from aiohttp.web import json_response
from aiohttp_swagger import setup_swagger
from sqlalchemy.exc import IntegrityError, InvalidRequestError
from dotenv import load_dotenv
from model import get_deimos, save_reports
from helpers import get_app_port, quit_app
from error import save_error_log, save_dom_error_log
from error import get_error_logs, get_dom_logs, get_all_error_logs

load_dotenv()

app = web.Application()
routes = web.RouteTableDef()


@routes.get('/deimos/quit')
async def ungracefully_quit_app(request):
    """
    ---
    description: Força o fechamento da aplicação.
    tags:
    - Deimos
    responses:
        "200":
            description: A operação foi bem sucedida.
    """
    Timer(3, quit_app).start()
    return web.Response(status=200, text='Encerrando...')


@routes.get('/deimos/error/all')
async def get_all_errors(request):
    """
    ---
    description: Obtêm informações sobre todos os erros registrados no banco de dados.
    tags:
    - Erros
    responses:
        "200":
            description: A operação foi bem sucedida.
        "500":
            description: Erro interno do servidor.
    """
    try:
        all_errors_list = get_all_error_logs()
        return json_response(all_errors_list, status=200)
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


@routes.get('/deimos/error/normal')
async def get_errors(request):
    """
    ---
    description: Obtêm informações sobre os erros comuns registrados no banco de dados.
    tags:
    - Erros
    responses:
        "200":
            description: A operação foi bem sucedida.
        "500":
            description: Erro interno do servidor.
    """
    try:
        error_list = get_error_logs()
        return json_response(error_list, status=200)
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


@routes.post('/deimos/error/normal')
async def handle_error_log(request: web.Request):
    """
    ---
    description: Salva informações sobre erros comuns.
    tags:
    - Erros
    responses:
        "201":
            description: A operação foi bem sucedida.
        "400":
            description: Há algum problema no corpo da requisição.
        "500":
            description: Erro interno do servidor.
    """
    try:
        error_log = await request.json()
        save_error_log(error_log)
        return web.Response(status=201, text='Operação bem sucedida.')
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


@routes.get('/deimos/error/dom')
async def get_dom_errors(request):
    """
    ---
    description: Obtêm informações sobre os erros relacionados ao DOM registrados no banco de dados.
    tags:
    - Erros
    responses:
        "200":
            description: A operação foi bem sucedida.
        "500":
            description: Erro interno do servidor.
    """
    try:
        dom_error_list = get_dom_logs()
        return json_response(dom_error_list, status=200)
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


@routes.post('/deimos/error/dom')
async def handle_dom_error_log(request: web.Request):
    """
    ---
    description: Salva informações sobre erros relacionados ao DOM.
    tags:
    - Erros
    responses:
        "201":
            description: A operação foi bem sucedida.
        "400":
            description: Há algum problema no corpo da requisição.
        "500":
            description: Erro interno do servidor.
    """
    try:
        error_log = await request.json()
        save_dom_error_log(error_log)
        return web.Response(status=201, text='Operação bem sucedida.')
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


@routes.post('/deimos/plunder/save')
async def save_plunder_reports(request: web.Request):
    """
    ---
    description: Salva informações sobre ataques no banco de dados do Deimos.
    tags:
    - Assistente de saque
    responses:
        "201":
            description: A operação foi bem sucedida.
        "400":
            description: Há algum problema no corpo da requisição.
        "500":
            description: Erro interno do servidor.
    """
    try:
        reports = await request.json()
        save_reports(reports)
        return web.Response(status=201, text='Operação bem sucedida.')
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))
    except (IntegrityError, InvalidRequestError) as err:
        return web.Response(status=500, text=repr(err))


@routes.post('/deimos/plunder/predict/{world}')
async def predict_resources(request: web.Request):
    """
    ---
    description: Faz uma previsão usando o Deimos.
    tags:
    - Assistente de saque
    responses:
        "200":
            description: A previsão foi feita com sucesso.
        "400":
            description: Há algum problema no corpo da requisição.
        "418":
            description: Ainda não há dados suficientes para a predição.
    """
    world = request.match_info['world']
    if type(world) is not str:
        return web.Response(status=400, text='Mundo inválido.')
    
    deimos = get_deimos(world)
    if deimos.ready is False:
        return web.Response(status=418, text='Ainda não há dados suficientes para a predição.')

    try:
        features = await request.json()
        prediction = deimos.predict(features)
        return web.Response(status=200, text=str(prediction))
    except (AttributeError, TypeError, JSONDecodeError) as err:
        return web.Response(status=400, text=repr(err))


app.add_routes(routes)

setup_swagger(app,
              title='Documentação',
              description='Endpoints do Deimos',
              api_version="1.0.0",
              contact='andrew.shien2@gmail.com',
              api_base_url='/',
              swagger_url='/deimos/doc')

web.run_app(app, host="127.0.0.1", port=get_app_port())
