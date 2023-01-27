import os
from sqlalchemy import create_engine, Column, Integer, Table
from sqlalchemy.orm import registry
from helpers import get_user_path, is_dev

db_path = os.path.join(get_user_path(), 'ares.db')

engine = create_engine(f'sqlite+pysqlite:///{db_path}', echo=is_dev(), future=True)
mapper_registry = registry()
Base = mapper_registry.generate_base()

def create_deimos_table(world: str):
    table_name = f'deimos_{world}'
    new_table = type(table_name, (Base, ), {
        '__tablename__': table_name,
        'id': Column(Integer, primary_key=True), # ID do relatório.
        'expected': Column(Integer, nullable=False), # Quantidade de recursos que se espera ter na aldeia.
        'carry': Column(Integer, nullable=False), # Capacidade de carga do modelo atacante.
        'atk_id': Column(Integer, nullable=False), # ID da aldeia atacante.
        'def_id': Column(Integer, nullable=False), # ID da aldeia defensora.
        'time': Column(Integer, nullable=False), # Minutos desde o último ataque.
        'plundered': Column(Integer, nullable=False) # Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos).
    })

    mapper_registry.metadata.create_all(engine, checkfirst=True)
    return new_table

