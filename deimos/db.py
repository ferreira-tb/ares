import os
from typing import Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, mapped_column
from helpers import get_user_path, is_dev

db_path = os.path.join(get_user_path(), 'ares.db')
engine = create_engine(f'sqlite+pysqlite:///{db_path}', echo=is_dev())

class Base(DeclarativeBase):
    pass


class DeimosTable(MappedAsDataclass, Base):
    __tablename__ = 'deimos_table'

    id: Mapped[int] = mapped_column(primary_key=True) # ID do relatório.
    time: Mapped[int] # Data do ataque (em segundos desde a época UNIX).
    world: Mapped[str] # Mundo onde ocorreu a batalha.
    expected: Mapped[int] # Quantidade de recursos que se espera ter na aldeia.
    carry: Mapped[int] # Capacidade de carga do modelo atacante.
    atk_id: Mapped[int] # ID da aldeia atacante.
    def_id: Mapped[int] # ID da aldeia defensora.
    minutes_since: Mapped[int] # Minutos desde o último ataque.
    plundered: Mapped[int] # Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos).


class ErrorLogTable(MappedAsDataclass, Base):
    __tablename__ = 'error_log'

    id: Mapped[Optional[int]] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] # Nome do erro.
    message: Mapped[str] # Mensagem do erro.
    time: Mapped[int] # Hora.
    ares: Mapped[str] # Versão do Ares.
    electron: Mapped[str] # Versão do Electron.
    chrome: Mapped[str] # Versão do Chrome.


class DOMErrorLogTable(MappedAsDataclass, Base):
    __tablename__ = 'dom_error_log'

    id: Mapped[Optional[int]] = mapped_column(primary_key=True, autoincrement=True)
    selector: Mapped[str] # Seletor CSS.
    url: Mapped[str] # URL da página onde ocorreu o erro.
    world: Mapped[Optional[str]] # Mundo onde ocorreu o erro.
    time: Mapped[int] # Hora.
    ares: Mapped[str] # Versão do Ares.
    electron: Mapped[str] # Versão do Electron.
    chrome: Mapped[str] # Versão do Chrome.


Base.metadata.create_all(engine, checkfirst=True)
