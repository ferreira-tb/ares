import os
import sys
import pandas
from sklearn import linear_model

csv_path = os.path.normpath(f'{sys.argv[2]}/reports.csv')
dataset = pandas.read_csv(csv_path)

X = dataset[['expected', 'carry', 'atk', 'def', 'min']].to_numpy()
y = dataset['plundered'].to_numpy()

plunder = linear_model.ElasticNet()
plunder.fit(X, y)