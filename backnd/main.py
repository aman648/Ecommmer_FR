from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
import Services as Services
from GenerateJWT import generateJWT
from Models import User as User


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


@app.route('/api/register', methods=['POST'])
def register():
    if 'username' not in request.get_json() or 'email' not in request.get_json() or 'password' not in request.get_json():
        return jsonify({"error": "Missing required fields"}), 400
        
    password = Services.hash_password(request.get_json()['password'])

    new_user = User.Users(username=request.get_json()['username'], password=password, email=request.get_json()['email'])
    Services.register_user(new_user)
    if not new_user:
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
    return jsonify({"token": jwt_token}), 200

#//API endpoint for user products
@jwt_required()
@app.route('/api/products', methods=['GET'])
def products():
    # add claim for jwt later:
    sample_products = [
        {"product_id": 1, "name": "Product 1", "description": "Description 1", "price": 10.0, "stock": 100},
        {"product_id": 2, "name": "Product 2", "description": "Description 2", "price": 20.0, "stock": 50},
    ]
    return jsonify({"products": sample_products}), 200




if __name__ == '__main__':
    app.run(debug=True)