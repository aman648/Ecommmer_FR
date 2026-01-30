

import hashlib


def register_user(user):
     
     pass

def authenticate_user(username, password):
    # Logic to authenticate a user
     if(username == "testuser" and password == "testpass"):
          return True
     return False


def hash_password(password):
    endoded = password.encode('utf-8')
    hash_object = hashlib.sha256(endoded)
    hex_dig = hash_object.hexdigest()
    # Logic to hash a password
    print(hex_dig)
    return hex_dig

