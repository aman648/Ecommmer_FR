from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import User as User
import Services as Services
from GenerateJWT import generateJWT



app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

#welcome route 
@app.route('/', methods=['GET'])
def welcome():
    return jsonify({"message": "Welcome to the E-commerce API"}), 200

# //API endpoint for user registration
@app.route('/api/register', methods=['POST'])
def register():
    if 'name' not in request.get_json() or 'email' not in request.get_json() or 'password' not in request.get_json():
        return jsonify({"error": "Missing required fields"}), 400
        
    password = Services.hash_password(request.get_json()['password'])
    new_user = User.Users(user_id=1, username=request.get_json()['name'], password=password, email=request.get_json()['email'])   
    Services.register_user(new_user)
    

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



if __name__ == '__main__':
    app.run(debug=True)