from flask import Flask, jsonify, request
from flask_cors import CORS
import User as User
import Services as Services
import GenerateJWT as GenerateJWT



app = Flask(__name__)
CORS(app)

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
    if request['username'] is None or request['password'] is None:
        return jsonify({"error": "Missing required fields"}), 400
    authenticated = Services.authenticate_user(request['username'], request['password'])
    if not authenticated:
        return jsonify({"error": "Invalid credentials"}), 401
    
    jwt_token = GenerateJWT.generate_jwt(request['username'])
    return jsonify({"token": jwt_token}), 200



if __name__ == '__main__':
    app.run(debug=True)