

import hashlib

from SQLdb import sqlDBConn


db = sqlDBConn()
db.execute_query('''CREATE TABLE IF NOT EXISTS users
              (user_id integer PRIMARY KEY autoincrement, username TEXT, password TEXT, email TEXT)''')
db.execute_query('''CREATE TABLE IF NOT EXISTS products
              (product_id integer PRIMARY KEY autoincrement, name TEXT, description TEXT, price REAL, stock INTEGER, is_active BOOLEAN)''')

def reset_password(username, new_password):
    # Logic to reset a user's password
    hashed_password = hash_password(new_password)
    query = "UPDATE users SET password = ? WHERE username = ?"
    params = (hashed_password, username)
    db.execute_query(query, params)
    print("Password reset for user:", username)
    return True
def register_user(user):
      
        # Logic to add user to the database
       
        query = "INSERT INTO users ( username, password, email) VALUES (?, ?, ?)"
        params = (user.username, user.password, user.email)
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


def UploadProduct(product):
    # Logic to upload a product to the database
    query = "INSERT INTO products (name, description, price, stock, is_active) VALUES (?, ?, ?, ?, ?)"
    params = (product.name, product.description, product.price, product.stock, product.is_active)
    db.execute_query(query, params)
    print("Product uploaded:", product.name)
    if db:
         return True
    return False

def get_all_products():
    # Logic to retrieve all products from the database
    query = "SELECT * FROM products"
    results = db.execute_query(query)
    products = []
    for row in results:
        product = {
            'product_id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'stock': row[4],
            'is_active': row[5]
        }
        products.append(product)
    print("Retrieved products:", products)
    return products