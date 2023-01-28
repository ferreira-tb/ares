import os
from typing import ClassVar, Dict, List, TypedDict, Self, NotRequired
import joblib
import numpy
from sqlalchemy.orm import Session
from sklearn import linear_model
from helpers import get_user_path
from db import create_deimos_table, engine


class DeimosReport(TypedDict):
    id: NotRequired[int] # ID do relatório.
    time: NotRequired[int] # Data do ataque (em milisegundos).
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
        self.table = create_deimos_table(world)

        try:
            # Tenta carregar um modelo já treinado.
            self.model = joblib.load(self.path)
            Deimos.active[world] = self
            
        except FileNotFoundError:
            # Se não houver, verifica se é possível treinar um novo.
            with Session(engine) as session:
                amount = session.query(self.table).count()
                if amount > 100:
                    raw_reports = session.query(self.table).all()
                    features, targets = parse_reports(raw_reports) # type: ignore 
                   
                    self.model = linear_model.ElasticNet()
                    self.model.fit(features, targets)

                    joblib.dump(self.model, self.path)
                else:
                    self.ready = False

            Deimos.active[world] = self
        

    def predict(self, features: DeimosReport) -> int:
        """ Faz uma previsão usando o modelo pertinente ao mundo. """

        if len(features) != 5:
            raise TypeError('O dicionário não possui a quantidade adequada de parâmetros.')

        feat_list = get_feats_from_deimos_report(features)

        # A lista precisa ser envelopada em outra lista.
        prediction = self.model.predict([feat_list])
        return int(prediction[0])


    def save(self, reports: List[DeimosReport]) -> None:
        """ Salva informações sobre ataques no banco de dados do Deimos. """

        if type(reports) is not list:
            raise TypeError('O objeto não é uma lista.')

        with Session(engine) as session:
            for report in reports:
                if len(report) != 8:
                    raise TypeError('O dicionário não possui a quantidade correta de itens.')
                    
                for value in report.values():
                    if type(value) is not int:
                        raise TypeError('Um dos valores no dicionário não é um número inteiro.')

                new_row = self.table(**report)
                session.add(new_row)

            session.commit()


def get_deimos(world: str) -> Deimos:
    if type(world) is not str:
        raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')
    elif world in Deimos.active:
        return Deimos.active[world]
    else:
        return Deimos(world)


def parse_reports(reports: List[DeimosReport]):
    features: List[List[int]] = []
    targets: List[int] = []

    for report in reports:
        r_feats = get_feats_from_deimos_report(report)
        features.append(r_feats)

        plundered = report.get('plundered')
        if type(plundered) is not int:
            raise TypeError('A quantia saqueada não é um número inteiro.')
        else:
            targets.append(plundered)

    return [numpy.array(features), numpy.array(targets)]


def get_feats_from_deimos_report(report: DeimosReport) -> List[int]:
    feat_list: List[int] = [
        report['expected'],
        report['carry'],
        report['atk_id'],
        report['def_id'],
        report['minutes_since']
    ]

    for feat in feat_list:
        if type(feat) is not int:
            raise TypeError('O item no relatório não é um número inteiro.')

    return feat_list
