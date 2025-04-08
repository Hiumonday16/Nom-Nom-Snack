from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from functools import wraps
from bson.objectid import ObjectId

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# MongoDB Connection
mongo_uri = os.getenv('MONGO_URI')
if not mongo_uri:
    raise ValueError("MONGO_URI environment variable is not set")
client = MongoClient(mongo_uri)
db = client.nomnomdb

# JWT Secret
jwt_secret = os.getenv('JWT_SECRET')
if not jwt_secret:
    raise ValueError("JWT_SECRET environment variable is not set")

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(" ")[1]  # Extract token from "Bearer <token>"
            payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 403
        except Exception as e:
            return jsonify({'message': f'Token error: {str(e)}'}), 403
        return f(*args, **kwargs)
    return decorated

# Register Route
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    postalCode = data.get('postalCode')
    phone = data.get('phone')
    
    if not all([name, email, password, address, postalCode, phone]):
        return jsonify({'message': 'All fields are required'}), 400

    if db.users.find_one({'email': email}):
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = {
        'username': name,
        'email': email,
        'password': hashed_pw,
        'address': address,
        'postalCode': postalCode,
        'phone': phone,
        'created_at': datetime.utcnow()
    }
    result = db.users.insert_one(user)
    
    token = jwt.encode({
        'id': str(result.inserted_id),
        'username': name,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, jwt_secret, algorithm="HS256")
    
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'username': name
    }), 201

# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    user = db.users.find_one({'username': username})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    token = jwt.encode({
        'id': str(user['_id']),
        'username': user['username'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, jwt_secret, algorithm="HS256")
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'username': user['username']
    }), 200

# Profile Route
@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile():
    try:
        user = db.users.find_one({'_id': ObjectId(request.user['id'])})
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify({
            'username': user['username'],
            'email': user['email'],
            'address': user['address'],
            'postalCode': user['postalCode'],
            'phone': user['phone']
        })
    except Exception as e:
        return jsonify({'message': f'Error fetching profile: {str(e)}'}), 500

# Products Route
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = list(db.products.find())
        for product in products:
            product['_id'] = str(product['_id'])
        return jsonify(products)
    except Exception as e:
        return jsonify({'message': f'Error fetching products: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)