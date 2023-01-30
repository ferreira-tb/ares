from time import time
from typing import List, NotRequired, TypedDict, Optional
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from db import engine, ErrorLogTable, DOMErrorLogTable

class ErrorLogType(TypedDict):
    name: str # Nome do erro.
    message: str # Mensagem do erro.
    time: int # Hora.
    ares: str # Versão do Ares.
    electron: str # Versão do Electron.
    chrome: str # Versão do Chrome.


class DOMErrorLogType(TypedDict):
    selector: str # Seletor CSS.
    url: str # URL da página onde ocorreu o erro.
    world: Optional[str] # Mundo onde ocorreu o erro.
    time: int # Hora.
    ares: str # Versão do Ares.
    electron: str # Versão do Electron.
    chrome: str # Versão do Chrome.


class ErrorLogTypeWithId(ErrorLogType):
    id: int # Não deve ser passado diretamente.


class DOMErrorLogTypeWithId(DOMErrorLogType):
    id: int # Não deve ser passado diretamente.


def save_error_log(error_log: ErrorLogType):
    """ Salva o registro de erro no banco de dados. """

    if not isinstance(error_log, dict):
        raise TypeError('O objeto não é um dicionário.')
    elif len(error_log) != 6:
        raise TypeError('O dicionário não possui a quantidade correta de itens.')

    for key, value in error_log.items():
        if key != 'time' and type(value) is not str:
            raise TypeError(f'O valor de {key.upper()} deveria ser uma string, mas não é.')
        elif key == 'time' and type(value) is not int:
            raise TypeError('O valor de TIME não possui a quantidade correta de itens.')

    with Session(engine, autobegin=True) as session:
        new_row = ErrorLogTable(id=None, **error_log)
        session.add(new_row)
        session.commit()


def save_dom_error_log(dom_error_log: DOMErrorLogType):
    """ Salva o registro de erro no banco de dados. """

    if not isinstance(dom_error_log, dict):
        raise TypeError('O objeto não é um dicionário.')
    elif len(dom_error_log) != 7:
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
        new_row = DOMErrorLogTable(id=None, **dom_error_log)
        session.add(new_row)
        session.commit()


def get_error_logs() -> list[ErrorLogType]:
    """ Obtêm todos os registros de erros comuns. """

    now = int(time())
    logs_to_return: List[ErrorLogType] = []
    with Session(engine, autobegin=True) as session:
        stmt = select(ErrorLogTable)
        error_logs = session.scalars(stmt).all()

        for error_log in error_logs:
            # Apaga o registro caso tenha sido feito há mais de um mês.
            if ((now - error_log.time) > 2592000):
                del_stmt = delete(ErrorLogTable).where(ErrorLogTable.id == error_log.id)
                session.execute(del_stmt)
                continue
            else:
                parsed_error_log = parse_error_log_table_row(error_log)
                logs_to_return.append(parsed_error_log)

        session.commit()

    return logs_to_return


def get_dom_logs() -> list[DOMErrorLogType]:
    """ Obtêm todos os registros de erros relacionados ao DOM. """

    now = int(time())
    logs_to_return: List[DOMErrorLogType] = []
    with Session(engine, autobegin=True) as session:
        stmt = select(DOMErrorLogTable)
        dom_logs = session.scalars(stmt).all()

        for dom_log in dom_logs:
            if ((now - dom_log.time) > 2592000):
                del_stmt = delete(DOMErrorLogTable).where(DOMErrorLogTable.id == dom_log.id)
                session.execute(del_stmt)
                continue
            else:
                parsed_dom_log = parse_dom_log_table_row(dom_log)
                logs_to_return.append(parsed_dom_log)

        session.commit()
    
    return logs_to_return


def get_all_error_logs() -> list[ErrorLogType | DOMErrorLogType]:
    """ Obtêm todos os registros de erros. """

    error_logs = get_error_logs()
    dom_logs = get_dom_logs()

    return [*error_logs, *dom_logs]


def parse_error_log_table_row(row: ErrorLogTable) -> ErrorLogTypeWithId:
    """ Cria um dicionário serializável a partir da linha na tabela. """

    if type(row.id) is not int:
        raise TypeError('O ID precisa ser um número inteiro.')

    parsed: ErrorLogTypeWithId = {
        'id': row.id,
        'name': row.name,
        'message': row.message,
        'time': row.time,
        'ares': row.ares,
        'electron': row.electron,
        'chrome': row.chrome
    }

    return parsed


def parse_dom_log_table_row(row: DOMErrorLogTable) -> DOMErrorLogTypeWithId:
    """ Cria um dicionário serializável a partir da linha na tabela. """

    if type(row.id) is not int:
        raise TypeError('O ID precisa ser um número inteiro.')

    parsed: DOMErrorLogTypeWithId = {
        'id': row.id,
        'selector': row.selector,
        'url': row.url,
        'world': row.world,
        'time': row.time,
        'ares': row.ares,
        'electron': row.electron,
        'chrome': row.chrome
    }

    return parsed
