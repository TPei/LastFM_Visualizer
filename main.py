__author__ = 'TPei'
import json
import requests
from handle_credentials import api_key

def pretty_print(json_data):
    print(json.dumps(json_data, sort_keys=True, indent=4, separators=(',', ': ')))

if __name__ == '__main__':
    base_url = 'http://ws.audioscrobbler.com/2.0/'
    params = {'method': 'user.gettoptracks',
              'api_key': api_key,
              'user': 'dragon5689',
              'format': 'json'}


    r = requests.get(base_url, params=params)

    pretty_print(r.json())




