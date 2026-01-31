

import hashlib

from SQLdb import sqlDBConn


db = sqlDBConn()
db.execute_query('''CREATE TABLE IF NOT EXISTS users
              (user_id TEXT PRIMARY KEY, username TEXT, password TEXT, email TEXT)''')


def register_user(user):
      
        # Logic to add user to the database
       
        query = "INSERT INTO users (user_id, username, password, email) VALUES (?, ?, ?, ?)"
        params = (user.user_id, user.username, user.password, user.email)
        db.execute_query(query, params)
        if db:
            print("User registered:", user.username)
            return True
            
        else:
            print("Failed to register user:", user.username)
            return False
           

def authenticate_user(username, password):
    # Logic to authenticate a user

     hasdedstored_password = hash_password(password)

     query = "SELECT password FROM users WHERE username = ? AND password = ?"
     result = db.execute_query(query, (username, hasdedstored_password))
     if result:
         print("User authenticated:", username)
         return True
     else:
         print("Authentication failed for user:", username)
         return False


def hash_password(password):
    endoded = password.encode('utf-8')
    hash_object = hashlib.sha256(endoded)
    hex_dig = hash_object.hexdigest()
    # Logic to hash a password
    print(hex_dig)
    return hex_dig

