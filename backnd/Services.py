
import mysql.connector
import hashlib



connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="*",
    database="my_db"
)


db = connection.cursor()

import hashlib

# ------------------ PASSWORD HASH ------------------

def hash_password(password):
    encoded = password.encode('utf-8')
    hash_object = hashlib.sha256(encoded)

    return hash_object.hexdigest()

def unhash_password(password, hashed_password):
    return hash_password(password) == hashed_password


# ------------------ USER ------------------

def register_user(user):
    query = "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)"
    hashed_password = hash_password(user.password)
    params = (user.username, hashed_password, user.email)
    

    db.execute(query, params)
    connection.commit()

    print("User registered:", user.username)
    return True


def authenticate_user(username, password):
   

    query = "SELECT password FROM users WHERE username = %s"
    db.execute(query, (username,))
    result = db.fetchone()
     
   
    if unhash_password(password, result[0]):
        print("User authenticated:", username)
        return True
    print("Authentication failed:", username ,result[0])
    return False  


def reset_password(username, new_password):
    hashed_password = hash_password(new_password)

    query = "UPDATE users SET password = %s WHERE username = %s"
    params = (hashed_password, username)

    db.execute(query, params)
    connection.commit()

    print("Password reset for:", username)
    return True


def getuserid(username):
    query = "SELECT user_id FROM users WHERE username = %s"
    result = db.execute_query(query, (username,))

    if result:
        return result[0][0]
    return None


def display_all_users():
    query = "SELECT * FROM users"
    results = db.execute_query(query)

    users = []
    for row in results:
        users.append({
            'user_id': row[0],
            'username': row[1],
            'password': row[2],
            'email': row[3]
        })

    return users


# ------------------ PRODUCTS ------------------

def UploadProduct(product):
    query = """
        INSERT INTO products (name, description, price, stock, is_active)
        VALUES (%s, %s, %s, %s, %s)
    """
    params = (
        product['name'],
        product['description'],
        product['price'],
        product['stock'],
        True
    )

    db.execute_query(query, params)
    db.commit()

    print("Product uploaded:", product['name'])
    return True


def get_all_products():
    query = "SELECT * FROM products"
    results = db.execute_query(query)

    products = []
    for row in results:
        products.append({
            'product_id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'stock': row[4],
            'is_active': row[5]
        })

    return products


def delete_products(product_id):
    query = "DELETE FROM products WHERE product_id = %s"
    db.execute(query, (product_id,))
    connection.commit()

    print("Deleted product:", product_id)
    return True


def delete_all():
    query = "DELETE FROM products"
    db.execute(query)
    connection.commit()

    print("All products deleted")
    return True


# ------------------ CART ------------------

def create_cart(user_id):
    query = "INSERT INTO cart (user_id) VALUES (%s)"
    db.execute(query, (user_id,))
    connection.commit()

    print("Cart created for user:", user_id)
    return True


def add_cart(user_id, product_id):
    # Check cart
    query = "SELECT cart_id FROM cart WHERE user_id = %s"
    result = db.execute_query(query, (user_id,))

    if not result:
        create_cart(user_id)
        result = db.execute(query, (user_id,))

    cart_id = result[0][0]

    query = "INSERT INTO Cartitems (product_id, cart_id) VALUES (%s, %s)"
    db.execute(query, (product_id, cart_id))
    connection.commit()

    return True


def get_cart_items(user_id):
    query = """
        SELECT p.product_id, p.name, p.description, p.price, p.stock
        FROM products p
        JOIN Cartitems ci ON p.product_id = ci.product_id
        JOIN cart c ON ci.cart_id = c.cart_id
        WHERE c.user_id = %s
    """

    results = db.execute_query(query, (user_id,))
    cart_items = []

    for row in results:
        cart_items.append({
            'product_id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'stock': row[4]
        })

    return cart_items
