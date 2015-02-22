__author__ = 'TPei'
import json
import requests
from handle_credentials import api_key


def pprint(json_data):
    print(json.dumps(json_data, sort_keys=True, indent=4, separators=(',', ': ')))

if __name__ == '__main__':
    base_url = 'http://ws.audioscrobbler.com/2.0/'
    #method = 'user.gettoptracks'
    method = 'user.topartists'

    params = {'method': method,
              'api_key': api_key,
              'user': 'dragon5689',
              'format': 'json'}


    r = requests.get(base_url, params=params)

    #tracks = r.json()['toptracks']['track']
    tracks = r.json()['topartists']['artist']
    values = []
    labels = []
    for track in tracks:
        values.append(int(track['playcount']))
        labels.append(track['name'])
        print(track['name'], track['playcount'])

    values = values[:10]
    labels = labels[:10]

    import matplotlib.pyplot as plt
    import numpy as np

    ind = np.arange(len(values))
    width = 0.35
    plt.bar(ind, values, width)
    plt.xticks(ind+width/2., labels, rotation=-45)

    plt.show()




