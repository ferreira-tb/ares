import os
from typing import Dict, List
import joblib
import numpy
from sqlalchemy.orm import Session
from sklearn import linear_model
from helpers import get_user_path
from db import create_deimos_table, engine

# Cache.
_active_deimos = {}

class Deimos:
    # Indica se o Deimos pode ser usado para previsões.
    # Será False caso não hajam dados o suficiente para treiná-lo.
    ready = True

    def __init__(self, world: str):
        if type(world) is not str:
            raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')

        user_path = get_user_path()
        self.path = os.path.join(user_path, f'deimos_{world}.joblib')
        self.table = create_deimos_table(world)

        try:
            # Tenta carregar um modelo já treinado.
            self.model = joblib.load(self.path)
            _active_deimos[world] = self
            
        except FileNotFoundError:
            # Se não houver, verifica se é possível treinar um novo.
            with Session(engine) as session:
                amount = session.query(self.table).count()
                if amount > 100:
                    raw_reports = session.query(self.table).all()
                    features, targets = parse_reports(raw_reports)
                    
                    self.model = linear_model.ElasticNet()
                    self.model.fit(features, targets)

                    joblib.dump(self.model, self.path)
                else:
                    self.ready = False

            _active_deimos[world] = self
        
    def predict(self, features: List[int]):
        """ Faz uma previsão usando o modelo pertinente ao mundo. """

        if type(features) is not list:
            raise TypeError('O objeto não é uma lista.')
        elif len(features) != 5:
            raise TypeError('A lista não possui o tamanho adequado.')

        for feat in features:
            if type(feat) is not int:
                raise TypeError('Um dos itens na lista não é um número inteiro.')

        prediction = self.model.predict([features])
        return int(prediction[0])

    def save(self, reports: List[List[int]]):
        """ Salva informações sobre ataques no banco de dados do Deimos. """

        if type(reports) is not list:
            raise TypeError('O objeto não é uma lista.')

        with Session(engine) as session:
            for report in reports:
                if type(report) is not list:
                    raise TypeError('A lista não possui apenas outras listas em seu interior.')
                # Diferentemente da lista usada para predição, nessa é obrigatória a presença do ID do relatório.
                # Ele deve ser o primeiro item da lista.
                elif len(report) != 7:
                    raise TypeError('A lista não possui o tamanho adequado.')
                
                for value in report:
                    if type(value) is not int:
                        raise TypeError('Um dos itens da lista não é um número inteiro.')

                # É crucial que a ordem dos itens dentro da lista seja respeitada.
                new_row = self.table(
                    id=report[0],
                    expected=report[1],
                    carry=report[2],
                    atk_id=report[3],
                    def_id=report[4],
                    time=report[5],
                    plundered=report[6],
                )

                session.add(new_row)

            session.commit()


def get_deimos(world: str) -> Deimos:
    if type(world) is not str:
        raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')
    elif world in _active_deimos:
        return _active_deimos[world]
    else:
        return Deimos(world)


def parse_reports(reports: list):
    features: List[List[int]] = []
    targets: List[int] = []

    for report in reports:
        r_feats = [
            report.expected,
            report.carry,
            report.atk_id,
            report.def_id,
            report.time
        ]

        for r_feat in r_feats:
            if type(r_feat) is not int:
                raise TypeError('O valor da feature não é um número inteiro.')
        else:
            features.append(r_feats)

        if type(report.plundered) is not int:
            raise TypeError('O valor do target não é um número inteiro.')
        else:
            targets.append(report.plundered)

    return [numpy.array(features), numpy.array(targets)]
