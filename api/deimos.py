import os
from typing import Dict, List
import joblib
import numpy
from sqlalchemy.orm import Session
from sklearn import linear_model
from helpers import get_user_path
from db import create_deimos_table, engine

class Deimos:
    # Indica se o Deimos pode ser usado para previsões.
    # Será False caso não hajam dados o suficiente para treiná-lo.
    active = True

    _queue: List[List[int]] = []
    _queue_size = 10

    def __init__(self, world: str):
        if type(world) is not str:
            raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')

        user_path = get_user_path()
        deimos_path = os.path.join(user_path, f'deimos_{world}.joblib')

        try:
            self._model = joblib.load(deimos_path)
            active_deimos[world] = self
            
        except FileNotFoundError:
            deimos_table = create_deimos_table(world)
        
            with Session(engine) as session:
                amount = session.query(deimos_table).count()
                if amount > 100:
                    raw_samples = session.query(deimos_table).all()
                    features, targets = parse_deimos_samples(raw_samples)
                    
                    self._model = linear_model.ElasticNet()
                    self._model.fit(features, targets)

                    joblib.dump(self._model, deimos_path) 
                else:
                    self.active = False

    def predict(self, features: List[int]):
        """ Faz uma previsão usando o modelo pertinente ao mundo. """

        if (type(features) is not list) or (len(features) != 5):
            raise TypeError

        for feat in features:
            if type(feat) is not int:
                raise TypeError

        prediction = self._model.predict([features])
        return int(prediction[0])


active_deimos: Dict[str, Deimos] = {}

def get_deimos(world: str):
    if type(world) is not str:
        raise TypeError('É preciso indicar a qual mundo o modelo deve ser associado.')
    elif world in active_deimos:
        return active_deimos[world]
    else:
        return Deimos(world)


def parse_deimos_samples(samples: list):
    features: List[List[int]] = []
    targets: List[int] = []

    for sample in samples:
        s_feats = [
            sample.expected,
            sample.carry,
            sample.atk_id,
            sample.def_id,
            sample.time
        ]

        for s_feat in s_feats:
            if type(s_feat) is not int:
                raise TypeError('O valor da feature não é um número inteiro.')
        else:
            features.append(s_feats)

        if type(sample.plundered) is not int:
            raise TypeError('O valor do target não é um número inteiro.')
        else:
            targets.append(sample.plundered)

    return [numpy.array(features), numpy.array(targets)]
