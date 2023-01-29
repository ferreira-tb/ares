import os
from time import time
from typing import ClassVar, TypedDict, Self, Dict, List, NotRequired
import joblib
import numpy
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from sklearn import linear_model
from helpers import get_user_path
from db import engine, DeimosTable


class DeimosTableType(TypedDict):
    id: NotRequired[int] # ID do relatório.
    time: NotRequired[int] # Data do ataque (em segundos desde a época UNIX).
    world: NotRequired[str] # Mundo onde ocorreu a batalha.
    expected: int # Quantidade de recursos que se espera ter na aldeia.
    carry: int # Capacidade de carga do modelo atacante.
    atk_id: int # ID da aldeia atacante.
    def_id: int # ID da aldeia defensora.
    minutes_since: int # Minutos desde o último ataque.
    plundered: NotRequired[int] # Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos).


class Deimos:
    # Cache.
    active: ClassVar[Dict[str, Self]] = {}

    # Indica se o Deimos pode ser usado para previsões.
    # Será False caso não hajam dados o suficiente para treiná-lo.
    ready = True

    def __init__(self, world: str):
        if type(world) is not str:
            raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')

        user_path = get_user_path()
        self.path = os.path.join(user_path, f'deimos_{world}.joblib')

        try:
            # Tenta carregar um modelo já treinado.
            self.model = joblib.load(self.path)
            Deimos.active[world] = self
            
        except FileNotFoundError:
            # Se não houver, verifica se é possível treinar um novo.
            with Session(engine, autobegin=True) as session:
                stmt = select(DeimosTable).where(DeimosTable.world == world)
                raw_reports = session.scalars(stmt).all()

                if len(raw_reports) > 100:
                    now = int(time())
                    reports: List[DeimosTableType] = []

                    for raw in raw_reports:
                        # Elimina o relatório caso ele tenha mais de dois meses.
                        if ((now - raw.time) > 5184000):
                            del_stmt = delete(DeimosTable).where(DeimosTable.id == raw.id)
                            session.execute(del_stmt)
                            continue
                        # Do contrário, adiciona-o à lista.
                        else:
                            report: DeimosTableType = {
                                'expected': raw.expected,
                                'carry': raw.carry,
                                'atk_id': raw.atk_id,
                                'def_id': raw.def_id,
                                'minutes_since': raw.minutes_since
                            }
                            reports.append(report)

                    # Só treina o modelo se ainda houverem relatórios o suficiente.
                    if len(reports) > 100:
                        features, targets = parse_reports(reports)
                    
                        self.model = linear_model.ElasticNet()
                        self.model.fit(features, targets)

                        joblib.dump(self.model, self.path)

                else:
                    self.ready = False

            Deimos.active[world] = self
        

    def predict(self, features: DeimosTableType) -> int:
        """ Faz uma previsão usando o modelo pertinente ao mundo. """

        if len(features) != 5:
            raise TypeError('O dicionário não possui a quantidade adequada de parâmetros.')

        # Precisa ser envelopada em outra lista.
        feat_list = get_features_from_report(features)
        prediction = self.model.predict([feat_list]) 
        return int(prediction[0], base=10)


def save_reports(reports: List[DeimosTableType]) -> None:
    """ Salva informações sobre ataques no banco de dados do Deimos. """

    if type(reports) is not list:
        raise TypeError('O objeto não é uma lista.')

    with Session(engine, autobegin=True) as session:
        for report in reports:
            if not isinstance(report, dict):
                raise TypeError('O objeto não é um dicionário.')
            elif len(report) != 9:
                raise TypeError('O dicionário não possui a quantidade correta de itens.')
                
            for key, value in report.items():
                if key != 'world' and type(value) is not int:
                    raise TypeError('Um dos valores no dicionário não é um número inteiro.')
                elif key == 'world' and type(value) is not str:
                    raise TypeError('O mundo é inválido.')

            stmt = select(DeimosTable).where(DeimosTable.id == report['id'])
            results = session.scalars(stmt).all()
            if len(results) == 0:
                new_row = DeimosTable(**report)
                session.add(new_row)

        session.commit()


def get_deimos(world: str) -> Deimos:
    if type(world) is not str:
        raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')
    elif world in Deimos.active:
        return Deimos.active[world]
    else:
        return Deimos(world)


def parse_reports(reports: List[DeimosTableType]):
    all_features: List[List[int]] = []
    all_targets: List[int] = []

    for report in reports:
        features = get_features_from_report(report)
        all_features.append(features)

        target = report.get('plundered')
        if type(target) is not int:
            raise TypeError('A quantia saqueada não é um número inteiro.')
        else:
            all_targets.append(target)

    return [numpy.array(all_features), numpy.array(all_targets)]


def get_features_from_report(report: DeimosTableType) -> List[int]:
    features: List[int] = [
        report['expected'],
        report['carry'],
        report['atk_id'],
        report['def_id'],
        report['minutes_since']
    ]

    for feat in features:
        if type(feat) is not int:
            raise TypeError('O item no relatório não é um número inteiro.')

    return features
