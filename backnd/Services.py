import pymysql
from pymysql import cursors
import hashlib

# Better: connection at module level, but cursor created per function
connection = pymysql.connect(
    host="127.0.0.1",           # prefer IP over "localhost" on macOS
    user="root",
    password="WelcomeSopra@33333",
    database="my_db",
    charset='utf8mb4',
    cursorclass=cursors.DictCursor,   # rows come as dicts → row['user_id']
    autocommit=False                      # we control commit manually
)

db = connection.cursor()  # alias for easier access in main.py


def hash_password(password: str) -> str:
    encoded = password.encode('utf-8')
    hash_object = hashlib.sha256(encoded)
    return hash_object.hexdigest()

def check_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

# ------------------ USER ------------------
def register_user(user):  # assuming user is an object with .username, .password, .email
    try:
        with connection.cursor() as cursor:
            hashed_password = hash_password(user.password)
            query = "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)"
            cursor.execute(query, (user.username, hashed_password, user.email))
        connection.commit()
        print(f"User registered: {user.username}")
        return True
    except Exception as e:
        connection.rollback()
        print(f"Register failed: {e}")
        return False

def authenticate_user(username: str, password: str) -> bool:
    try:
        with connection.cursor() as cursor:
            query = "SELECT password FROM users WHERE username = %s"
            cursor.execute(query, (username,))
            result = cursor.fetchone()  # one row or None
            if result is None:
                return False
            stored_hash = result['password']
            if check_password(password, stored_hash):
                print(f"User authenticated: {username}")
                return True
            return False
    except Exception as e:
        print(f"Auth failed: {e}")
        return False

def reset_password(username: str, new_password: str) -> bool:
    try:
        with connection.cursor() as cursor:
            hashed = hash_password(new_password)
            query = "UPDATE users SET password = %s WHERE username = %s"
            cursor.execute(query, (hashed, username))
        connection.commit()
        print(f"Password reset for: {username}")
        return cursor.rowcount > 0  # True only if actually updated someone
    except Exception as e:
        connection.rollback()
        print(f"Reset failed: {e}")
        return False
def getcartitems(user_id: int):
    try:
        with connection.cursor() as cursor:
            query = """
                SELECT p.product_id, p.name, p.description, p.price, p.stock
                FROM products p
                JOIN Cartitems ci ON p.product_id = ci.product_id
                JOIN cart c ON ci.cart_id = c.cart_id
                WHERE c.user_id = %s
            """
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"Get cart items failed: {e}")
        return []
    
def remove_cart_item(user_id: int, product_id: int) -> bool:
    try:
        with connection.cursor() as cursor:
            # Get cart_id for user
            cursor.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()
            if not row:
                return False  # no cart, so nothing to remove
            cart_id = row['cart_id']

            # Delete the specific item from Cartitems
            cursor.execute(
                "DELETE FROM Cartitems WHERE cart_id = %s AND product_id = %s",
                (cart_id, product_id)
            )
        connection.commit()
        success = cursor.rowcount > 0
        if success:
            print(f"Removed product {product_id} from user {user_id}'s cart")
        return success
    except Exception as e:
        connection.rollback()
        print(f"Remove cart item failed: {e}")
        return False    
def getuserid(username: str):
    try:
        with connection.cursor() as cursor:
            query = "SELECT user_id FROM users WHERE username = %s"
            cursor.execute(query, (username,))
            row = cursor.fetchone()
            return row['user_id'] if row else None
    except Exception as e:
        print(f"Get user id failed: {e}")
        return None

def display_all_users():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]  # already dicts
    except Exception as e:
        print(f"Display users failed: {e}")
        return []

# ------------------ PRODUCTS ------------------
def UploadProduct(product):  # assuming product is dict now
    try:
        with connection.cursor() as cursor:
            query = """
                INSERT INTO products (name, description, price, stock, is_active)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                product['name'],
                product['description'],
                product['price'],
                product['stock'],
                True
            ))
        connection.commit()
        success = cursor.rowcount > 0
        if success:
            print(f"Product uploaded: {product['name']}")
        return success
    except Exception as e:
        connection.rollback()
        print(f"Upload product failed: {e}")
        return False

def get_all_products():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM products")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]  # safe even if already dicts
    except Exception as e:
        print(f"Get products failed: {e}")
        return []

def delete_products(product_id: int) -> bool:
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
        connection.commit()
        success = cursor.rowcount > 0
        if success:
            print(f"Deleted product: {product_id}")
        return success
    except Exception as e:
        connection.rollback()
        print(f"Delete product failed: {e}")
        return False

def delete_all() -> bool:
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM products")
        connection.commit()
        print("All products deleted")
        return True
    except Exception as e:
        connection.rollback()
        print(f"Delete all failed: {e}")
        return False

# ------------------ CART ------------------
def create_cart(user_id: int) -> bool:
    try:
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO cart (user_id) VALUES (%s)", (user_id,))
        connection.commit()
        print(f"Cart created for user: {user_id}")
        return True
    except Exception as e:
        connection.rollback()
        print(f"Create cart failed: {e}")
        return False

def add_cart(user_id: int, product_id: int) -> bool:
    try:
        with connection.cursor() as cursor:
            # Get or create cart
            cursor.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()
            if not row:
                create_cart(user_id)
                cursor.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
                row = cursor.fetchone()
                if not row:
                    return False
            cart_id = row['cart_id']

            # Add item (you may want to check if already exists + increment qty instead)
            cursor.execute(
                "INSERT INTO Cartitems (product_id, cart_id) VALUES (%s, %s)",
                (product_id, cart_id)
            )
        connection.commit()
        return True
    except Exception as e:
        connection.rollback()
        print(f"Add to cart failed: {e}")
        return False

def get_cart_items(user_id: int):
    try:
        with connection.cursor() as cursor:
            query = """
                SELECT p.product_id, p.name, p.description, p.price, p.stock
                FROM products p
                JOIN Cartitems ci ON p.product_id = ci.product_id
                JOIN cart c ON ci.cart_id = c.cart_id
                WHERE c.user_id = %s
            """
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"Get cart items failed: {e}")
        return []