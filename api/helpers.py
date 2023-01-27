import os
import sys
import signal

def quit_app():
    """ Encerra a aplicação. """
    pid = os.getpid()
    os.kill(pid, signal.SIGINT)


# sys.argv
# 1 - Porta usada pela aplicação.
# 2 - Caminho para o diretório padrão usado pelo Electron.

def get_user_path():
    """ Caminho para o diretório padrão usado pelo Electron. """
    try:
        return os.path.normpath(sys.argv[2])
    except IndexError as err:
        if is_dev():
            user_path = os.environ.get('USER_DATA_PATH')
            if type(user_path) is not str:
                raise RuntimeError('Não foi possível determinar o diretório padrão.')
            return os.path.normpath(user_path)
        else:
            raise err


def get_app_port():
    """ Porta usada pela aplicação. """
    try:
        return int(sys.argv[1])
    except IndexError:
        return 8000


def is_dev():
    return os.environ.get('ARES_MODE') == 'dev'
