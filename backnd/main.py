from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
import Services as Services
from GenerateJWT import generateJWT
from Models import User as User
from Models import Products as Products
import json


app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

#welcome route 
@app.route('/', methods=['GET'])
def welcome():
    return jsonify({"message": "Welcome to the E-commerce API"}), 200

# Dasboard for eapp
@jwt_required()
@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    jwt = request.headers.get('Authorization')
    return jsonify({"message": "This is the dashboard"}), 200
# //API endpoint for user registration
@app.route('/api/reset_password', methods=['POST'])
def reset_password():
    if 'username' not in request.get_json() or 'new_password' not in request.get_json():
        return jsonify({"error": "Missing required fields"}), 400
        
    username = request.get_json()['username']
    new_password = request.get_json()['new_password']
    hashed_password = Services.hash_password(new_password)
    
    r1 = Services.reset_password(username, hashed_password)
    if not r1:
        return jsonify({"error": "Failed to reset password"}), 500
    return jsonify({"message": "Password reset successfully"}), 200

@app.route('/api/addcart', methods=['POST'])
def add_cart():
    if 'user_id' not in request.get_json() or 'product_id' not in request.get_json():
        return jsonify({"error": "Missing required fields"}), 400
    user_id = request.get_json()['user_id']
    product_id = request.get_json()['product_id']
    
    if not Services.add_cart(user_id, product_id):
        return jsonify({"error": "Failed to add product to cart"}), 500
    return jsonify({"message": "Product added to cart successfully"}), 200

@app.route('/api/register', methods=['POST'])
def register():
    if 'username' not in request.get_json() or 'email' not in request.get_json() or 'password' not in request.get_json():
        return jsonify({"error": "Missing required fields"}), 400
        
    password = Services.hash_password(request.get_json()['password'])

    new_user = User.Users(username=request.get_json()['username'], password=password, email=request.get_json()['email'])
    s1 = Services.register_user(new_user)
    
    
    if not s1:
        return jsonify({"error": "Failed to register user"}), 500
    

    return jsonify({"message": "User registered successfully"}), 200


# //API endpoint for user login
@app.route('/api/login', methods=['POST'])
def login():
    userinfo = request.get_json()
    if userinfo['username'] is None or userinfo['password'] is None:
        return jsonify({"error": "Missing required fields"}), 400
    authenticated = Services.authenticate_user(userinfo['username'], userinfo['password'])
    if not authenticated:
        return jsonify({"error": "Invalid credentials"}), 401
    
    jwt_token = generateJWT(userinfo['username'])
    user_id = Services.getuserid(userinfo['username'])
    Services.create_cart(user_id)
    print("User ID for JWT generation:", user_id)
    if jwt_token is None or user_id is None:
        return jsonify({"error": "Failed to generate token"}), 500
    return jsonify({"token": jwt_token}), 200
#return all the users::

@app.route('/api/users', methods=['GET'])
def get_users():
    users = Services.display_all_users()
    if users is None:
        return jsonify({"error": "Failed to retrieve users"}), 500
    return jsonify({"users": users}), 200

#//API endpoint for user products
@jwt_required()
@app.route('/api/products', methods=['POST'])
def products():
    products = request.get_json()
    

    product1 = Products.Products(
        product_id=products.get("product_id"),
        name=products.get("name"),
        description=products.get("description"),
        price=products.get("price"),
        stock=products.get("stock")
    )
    addproduct = Services.UploadProduct(product1)
    if not addproduct:
        return jsonify({"error": "Failed to create products"}), 500
        

    return jsonify({"products created": products}), 200

@app.route('/api/Setproducts', methods=['GET'])
def Setproducts():
    with open ("demdatauser.json","r") as file:
        products = json.load(file)
    
    for p in products:
        if(Services.UploadProduct(p)):
           continue
    return jsonify('Product added Successfully')
        

@jwt_required()
@app.route('/api/getproducts', methods=['GET'])
def get_products(): 
    products = Services.get_all_products()
    if products is None:
        return jsonify({"error": "Failed to retrieve products"}), 500
    return jsonify({"products": products}), 200

@app.route('/api/deleteproduct/<int:product_id>', methods=['DELETE'])
def delete_products():
    d = Services.delete_products(request['products_id'])
    if d:
        return jsonify("deleted sucessfully}=")
    return jsonify('Unsucccessfull')
   
@app.route('/api/delete_all',methods=['DELETE'])
def delete_all():
    if not Services.delete_all():
        return jsonify({"error": "Failed to delete products"}), 500
    return jsonify({"message": "All products deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)