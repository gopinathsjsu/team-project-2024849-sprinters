from flask import Blueprint, request, jsonify
from backend.models import db, RestaurantManager, Restaurant, MenuItem
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from flask import Blueprint, request, jsonify

support_routes = Blueprint('support', __name__)
restaurant_manager_routes = Blueprint('restaurant_manager', __name__)

@restaurant_manager_routes.route('/restaurant-manager/register', methods=['POST'])
def register_manager():
    data = request.get_json()
    if RestaurantManager.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    manager = RestaurantManager(
        name=data['name'],
        email=data['email'],
        contact_number=data.get('contact_number')
    )
    manager.password_hash = generate_password_hash(data['password'])

    db.session.add(manager)
    db.session.commit()
    return jsonify({'message': 'Registered'}), 201


@restaurant_manager_routes.route('/restaurant-manager/login', methods=['POST'])
def login_manager():
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    manager = RestaurantManager.query.filter_by(email=data['email']).first()
    if not manager or not check_password_hash(manager.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(manager.id))
    refresh_token = create_refresh_token(identity=str(manager.id))

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'manager_id': manager.id,
        'manager_name': manager.name
    }), 200


@restaurant_manager_routes.route('/restaurant', methods=['POST'])
@jwt_required()
def create_restaurant():
    manager_id = get_jwt_identity()
    data = request.get_json()

    restaurant = Restaurant(
        name=data['name'],
        neighborhood=data['neighborhood'],
        cuisines=data['cuisines'],
        cost=data['cost'],
        operation_hours=data['operation_hours'],
        dining_style=data['dining_style'],
        dress_code=data['dress_code'],
        parking_details=data['parking_details'],
        payment_options=data['payment_options'],
        cross_street=data['cross_street'],
        phone=data['phone'],
        executive_chef=data.get('executive_chef'),
        description=data['description'],
        website=data['website'],
        preview_img=data['preview_img'],
        manager_id=manager_id,
        is_approved=False
    )
    db.session.add(restaurant)
    db.session.commit()

    return jsonify({'message': 'Restaurant created successfully'}), 201



@restaurant_manager_routes.route('/restaurant-manager/<int:manager_id>', methods=['GET'])
@jwt_required()
def get_manager_info(manager_id):
    current_manager_id = int(get_jwt_identity())

    if manager_id != current_manager_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    manager = RestaurantManager.query.get(manager_id)
    if not manager:
        return jsonify({'error': 'Manager not found'}), 404

    return jsonify(manager.to_dict()), 200


@restaurant_manager_routes.route('/restaurant-manager/manage-restaurants', methods=['GET'])
@jwt_required()
def get_my_restaurants():
    manager_id = get_jwt_identity()
    restaurants = Restaurant.query.filter_by(manager_id=manager_id).all()

    result = []
    for restaurant in restaurants:
        result.append({
            'id': restaurant.id,
            'name': restaurant.name,
            'location': restaurant.neighborhood,
            'status': 'Approved' if restaurant.is_approved else 'Pending'
        })

    return jsonify(result), 200


@restaurant_manager_routes.route('/restaurant/<int:restaurant_id>', methods=['GET'])
@jwt_required()
def get_restaurant_by_id(restaurant_id):
    manager_id = get_jwt_identity()
    restaurant = Restaurant.query.filter_by(id=restaurant_id, manager_id=manager_id).first()

    if not restaurant:
        return jsonify({'error': 'Restaurant not found or unauthorized'}), 404

    return jsonify(restaurant.to_dict()), 200


@restaurant_manager_routes.route('/restaurant/<int:restaurant_id>', methods=['PUT'])
@jwt_required()
def update_restaurant(restaurant_id):
    manager_id = get_jwt_identity()
    restaurant = Restaurant.query.filter_by(id=restaurant_id, manager_id=manager_id).first()

    if not restaurant:
        return jsonify({'error': 'Unauthorized or not found'}), 404

    data = request.get_json()

    # Update fields
    for key in data:
        if hasattr(restaurant, key):
            setattr(restaurant, key, data[key])

    db.session.commit()
    return jsonify({'message': 'Restaurant updated successfully'}), 200


@restaurant_manager_routes.route('/restaurant/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()
def delete_restaurant(restaurant_id):
    manager_id = get_jwt_identity()
    restaurant = Restaurant.query.filter_by(id=restaurant_id, manager_id=manager_id).first()

    if not restaurant:
        return jsonify({'error': 'Restaurant not found or unauthorized'}), 404

    db.session.delete(restaurant)
    db.session.commit()

    return jsonify({'message': 'Restaurant deleted successfully'}), 200


@restaurant_manager_routes.route('/menu-items/<int:restaurant_id>', methods=['GET'])
@jwt_required()
def get_menu_items(restaurant_id):
    manager_id = get_jwt_identity()
    restaurant = Restaurant.query.filter_by(id=restaurant_id, manager_id=manager_id).first()

    if not restaurant:
        return jsonify({'error': 'Unauthorized or restaurant not found'}), 404

    menu_items = restaurant.menu_items
    return jsonify([item.to_dict() for item in menu_items]), 200

@restaurant_manager_routes.route('/menu-items', methods=['POST'])
@jwt_required()
def add_menu_item():
    manager_id = get_jwt_identity()
    data = request.get_json()
    restaurant = Restaurant.query.filter_by(id=data['restaurant_id'], manager_id=manager_id).first()

    if not restaurant:
        return jsonify({'error': 'Restaurant not found or not owned by you'}), 404

    item = MenuItem(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        restaurant_id=restaurant.id
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({'message': 'Menu item added'}), 201

@restaurant_manager_routes.route('/menu-items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_menu_item(item_id):
    manager_id = get_jwt_identity()
    item = MenuItem.query.get(item_id)

    if not item or item.restaurant.manager_id != int(manager_id):
        return jsonify({'error': 'Unauthorized or not found'}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Menu item deleted'}), 200


@restaurant_manager_routes.route('/menu-items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_menu_item(item_id):
    manager_id = get_jwt_identity()
    item = MenuItem.query.get(item_id)

    if not item or item.restaurant.manager_id != int(manager_id):
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    item.name = data['name']
    item.description = data['description']
    item.price = data['price']
    db.session.commit()
    return jsonify({'message': 'Menu item updated successfully'}), 200


@restaurant_manager_routes.route('/restaurant-manager/approved-restaurants', methods=['GET'])
@jwt_required()
def get_approved_restaurants():
    manager_id = get_jwt_identity()
    restaurants = Restaurant.query.filter_by(manager_id=manager_id, is_approved=True).all()

    return jsonify([{
        'id': r.id,
        'name': r.name,
        'location': r.neighborhood,
        'status': 'Approved'
    } for r in restaurants]), 200





@support_routes.route('/support/contact', methods=['POST'])
def contact_support():
    data = request.get_json()
    # You can save this to DB or email to admin
    print(f"Support callback requested from {data['name']} ({data['email']})")
    return jsonify({'message': 'Callback request received'}), 200




