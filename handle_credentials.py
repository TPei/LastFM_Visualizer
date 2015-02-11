__author__ = 'TPei'
import getpass

# provides lastfm api key from txt file
# if no txt file available, asks for input
try:
    file = open('api_key.txt')
    api_key = next(file)
    file.close()
except OSError:
    username = input('please provide a lastfm api key: ')

api_key = api_key.replace('\n', '').replace('\r', '')