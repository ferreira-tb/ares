from typing import TypedDict, Optional
from sqlalchemy.orm import Session
from db import engine, ErrorLog, DOMErrorLog

class ErrorLogType(TypedDict):
    name: str # Nome do erro.
    message: str # Mensagem do erro.
    time: int # Hora.
    electron: str # Versão do Electron.
    chrome: str # Versão do Chrome.


class DOMErrorLogType(TypedDict):
    selector: str # Seletor CSS.
    url: str # URL da página onde ocorreu o erro.
    world: Optional[str] # Mundo onde ocorreu o erro.
    time: int # Hora.
    electron: str # Versão do Electron.
    chrome: str # Versão do Chrome.


def save_error_log(error_log: ErrorLogType):
    if not isinstance(error_log, dict):
        raise TypeError('O objeto não é um dicionário.')
    elif len(error_log) != 5:
        raise TypeError('O dicionário não possui a quantidade correta de itens.')

    for key, value in error_log.items():
        if key != 'time' and type(value) is not str:
            raise TypeError(f'O valor de {key.upper()} deveria ser uma string, mas não é.')
        elif key == 'time' and type(value) is not int:
            raise TypeError('O valor de TIME não possui a quantidade correta de itens.')

    with Session(engine, autobegin=True) as session:
        new_row = ErrorLog(id=None, **error_log)
        session.add(new_row)
        session.commit()


def save_dom_error_log(dom_error_log: DOMErrorLogType):
    if not isinstance(dom_error_log, dict):
        raise TypeError('O objeto não é um dicionário.')
    elif len(dom_error_log) != 6:
        raise TypeError('O dicionário não possui a quantidade correta de itens.')

    for key, value in dom_error_log.items():
        if key != 'time' and type(value) is not str:
            if key == 'world' and value == None:
                continue
            else:
                raise TypeError(f'O valor de {key.upper()} deveria ser uma string, mas não é.')
        elif key == 'time' and type(value) is not int:
            raise TypeError('O valor de TIME não possui a quantidade correta de itens.')

    with Session(engine, autobegin=True) as session:
        new_row = DOMErrorLog(id=None, **dom_error_log)
        session.add(new_row)
        session.commit()
