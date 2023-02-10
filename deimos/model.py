import os
from time import time
from typing import ClassVar, Tuple, Self, TypedDict, Dict, List, NotRequired
import joblib
import numpy
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from sklearn.linear_model import ElasticNet
from sklearn.model_selection import train_test_split
from helpers import get_user_path, calc_distance, TooOldError
from db import engine, DeimosTable, DeimosTableHistory


class DeimosTableType(TypedDict):
    report_id: NotRequired[int] # ID do relatório.
    time: NotRequired[int] # Data do ataque (em segundos desde a época UNIX).
    world: NotRequired[str] # Mundo onde ocorreu a batalha.
    plundered: NotRequired[int] # Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos).

    minutes_since: int # Minutos desde o último ataque.
    expected: int # Quantidade de recursos que se espera ter na aldeia.
    carry: int # Capacidade de carga do modelo atacante.
    origin_x: int # Coordenadas da aldeia atacante.
    origin_y: int
    dest_x: int # Coordenadas da aldeia defensora.
    dest_y: int
    distance: float # Distância entre as aldeias.
    

class FitModelReturnType(TypedDict):
    time: int # Data do treino (em segundos desde a época UNIX).
    estimator: str # Nome do modelo usado para as estimativas.
    report_amount: int # Quantidade de relatórios usados.
    train_score: float # Pontuação do modelo no treinamento.
    test_score: float # Pontuação do modelo no teste.


class DeimosTableHistoryType(FitModelReturnType):
    world: str # Mundo no qual o modelo será usado.


class ReportType(TypedDict):
    report_id: int # ID do relatório.
    world: str # Mundo onde ocorreu a batalha.


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
            with Session(engine, autobegin=True) as session:
                stmt = select(DeimosTableHistory).where(DeimosTableHistory.world == world)
                order_stmt = stmt.order_by(DeimosTableHistory.time.desc())
                history = session.scalars(order_stmt).all()

                # Refaz o treinamento se o último tiver sido há mais de um dia.
                if len(history) > 0:
                    now = int(time())
                    if (now - history[0].time) > 86400:
                        raise TooOldError()

                session.rollback()

            # Tenta carregar o último modelo treinado.
            self.model = joblib.load(self.path)
            Deimos.active[world] = self
            
        except (FileNotFoundError, TooOldError):
            # Se não houver, verifica se é possível treinar um novo.
            with Session(engine, autobegin=True) as session:
                stmt = select(DeimosTable).where(DeimosTable.world == world)
                raw_reports = session.scalars(stmt).all()

                if len(raw_reports) > 100:
                    now = int(time())
                    reports: List[DeimosTableType] = []

                    for raw in raw_reports:
                        # Elimina o relatório caso ele tenha mais de dois meses.
                        if (now - raw.time) > 5184000:
                            del_stmt = delete(DeimosTable).where(DeimosTable.id == raw.id)
                            session.execute(del_stmt)
                            continue
                        # Do contrário, adiciona-o à lista.
                        else:
                            distance = calc_distance(
                                originX=raw.origin_x,
                                originY=raw.origin_y,
                                destX=raw.dest_x,
                                destY=raw.dest_y
                            )

                            report: DeimosTableType = {
                                'plundered': raw.plundered,
                                'minutes_since': raw.minutes_since,
                                'expected': raw.expected,
                                'carry': raw.carry,
                                'origin_x': raw.origin_x,
                                'origin_y': raw.origin_y,
                                'dest_x': raw.dest_x,
                                'dest_y': raw.dest_y,
                                'distance': distance,
                            }
                            reports.append(report)

                    # Só treina o modelo se ainda houverem relatórios o suficiente.
                    if len(reports) > 100:
                        self.model, model_info = fit_model(reports)

                        new_row = DeimosTableHistory(world=world, **model_info)
                        session.add(new_row)

                        joblib.dump(self.model, self.path)

                else:
                    self.ready = False

                session.commit()

            Deimos.active[world] = self
        

    def predict(self, features: DeimosTableType) -> int:
        """ Faz uma previsão usando o modelo pertinente ao mundo. """

        # minutes_since, expected, carry, origin_x, origin_y, dest_x, dest_y.
        if len(features) != 7:
            raise TypeError('O dicionário não possui a quantidade adequada de parâmetros.')

        # Precisa ser envelopada em outra lista.
        feat_list = get_features_from_report(features)
        prediction = self.model.predict([feat_list]) 
        return int(prediction[0])


def fit_model(reports: list[DeimosTableType]) -> Tuple[ElasticNet, FitModelReturnType]:
    X, y = parse_reports(reports)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.05)

    model = ElasticNet()
    model.fit(X_train, y_train)
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)

    model_info: FitModelReturnType = {
        'time': int(time()),
        'estimator': 'ElasticNet',
        'report_amount': len(reports),
        'train_score': float(train_score),
        'test_score': float(test_score)
    }

    return (model, model_info)


def report_exists(report_info: ReportType) -> bool:
    if not isinstance(report_info, dict):
        raise TypeError('O objeto não é um dicionário.')

    report_id = report_info['report_id']
    world = report_info['world']

    if type(report_id) is not int:
        raise TypeError('O ID não é um número inteiro.')
    elif type(world) is not str:
        raise TypeError('O mundo não é uma string.')

    with Session(engine, autobegin=True) as session:
        stmt = select(DeimosTable).where(DeimosTable.report_id == report_id).where(DeimosTable.world == world)
        result = session.execute(stmt).scalar_one_or_none()
        session.rollback()
        
    # Se o resultado for None, o relatório não existe.
    return result is not None


def save_reports(reports: List[DeimosTableType]) -> None:
    """ Salva informações sobre ataques no banco de dados do Deimos. """

    if type(reports) is not list:
        raise TypeError('O objeto não é uma lista.')

    with Session(engine, autobegin=True) as session:
        for report in reports:
            if not isinstance(report, dict):
                raise TypeError('O objeto não é um dicionário.')
            # report_id, time, world, plundered, minutes_since, expected, carry, origin_x, origin_y, dest_x, dest_y.
            elif len(report) != 11:
                raise TypeError('O dicionário não possui a quantidade correta de itens.')
                
            for key, value in report.items():
                if (key != 'world') and type(value) is not int:
                    raise TypeError('Um dos valores no dicionário não é um número inteiro.')
                elif key == 'world' and type(value) is not str:
                    raise TypeError('O mundo é inválido.')
            
            report['distance'] = calc_distance(
                originX=report['origin_x'],
                originY=report['origin_y'],
                destX=report['dest_x'],
                destY=report['dest_y']
            )

            stmt = select(DeimosTable).where(DeimosTable.report_id == report['report_id']).where(DeimosTable.world == report['world'])
            results = session.scalars(stmt).all()
            if len(results) == 0:
                new_row = DeimosTable(id=None, **report)
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
    all_features: List[List[int | float]] = []
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


def get_features_from_report(report: DeimosTableType) -> List[int | float]:
    features: List[int | float] = [
        report['minutes_since'],
        report['expected'],
        report['carry'],
        report['origin_x'],
        report['origin_y'],
        report['dest_x'],
        report['dest_y']
    ]

    for feat in features:
        if type(feat) is not int:
            raise TypeError('O item no relatório não é um número inteiro.')

    distance = calc_distance(
        originX=report['origin_x'],
        originY=report['origin_y'],
        destX=report['dest_x'],
        destY=report['dest_y']
    )

    features.append(distance)
    return features
