import os
import pandas
# import numpy
from sklearn import linear_model
# from sklearn import metrics
# from sklearn.model_selection import train_test_split

csv_path = os.path.normpath('__testpy__/reports.csv')
dataset = pandas.read_csv(csv_path)

X = dataset[['expected', 'carry', 'atk', 'def', 'min']].to_numpy()
y = dataset['plundered'].to_numpy()

# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

plunder = linear_model.ElasticNet()
plunder.fit(X, y)

# y_pred = plunder.predict(X_test)
# data_frame = pandas.DataFrame({'Actual': y_test, 'Predicted': y_pred})
# print(data_frame.head(25))

# print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))  
# print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))  
# print('Root Mean Squared Error:', numpy.sqrt(metrics.mean_squared_error(y_test, y_pred)))