import os
import pandas
import joblib
from sklearn import linear_model
from helpers import get_user_path

class _Deimos:
    def __init__(self):
        user_path = get_user_path()
        deimos_path = os.path.join(user_path, 'deimos.joblib')

        try:
            self._model = joblib.load(deimos_path)
        except FileNotFoundError:
            csv_path = os.path.join(user_path, 'reports.csv')
            dataset = pandas.read_csv(csv_path)

            x = dataset[['expected', 'carry', 'atk', 'def', 'min']].to_numpy()
            y = dataset['plundered'].to_numpy()

            self._model = linear_model.ElasticNet()
            self._model.fit(x, y)

            joblib.dump(self._model, deimos_path)

    def predict(self, sample):
        return self._model.predict([sample])


deimos = _Deimos()
