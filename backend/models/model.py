from .db import db, environment, SCHEMA
from .user import User
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime


Base = declarative_base()

# favorites = db.Table(
#     "favorites",
#     db.Model.metadata,
#     db.Column(
#         "user_id",
#         db.Integer,
#         db.ForeignKey("users.id"),
#         primary_key=True
#     ),
#     db.Column(
#         "restaurant_id",
#         db.Integer,
#         db.ForeignKey("restaurants.id"),
#         primary_key=True
#     ),
# )


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    neighborhood = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    cuisines = db.Column(db.String(255), nullable=False)
    cost = db.Column(db.String(50), nullable=False)
    operation_hours = db.Column(db.String(255), nullable=False)
    
    phone = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(2000), nullable=False)
    website = db.Column(db.String(2000), nullable=False)
    preview_img = db.Column(db.String(2000), nullable=False)
    reservations = db.relationship("Reservation", back_populates="restaurant", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="restaurant", cascade="all, delete-orphan")
    saved_restaurants = db.relationship("SavedRestaurant", back_populates="restaurants", cascade="all, delete-orphan")
    manager_id = db.Column(db.Integer, db.ForeignKey("restaurant_managers.id"), nullable=True)
    is_approved = db.Column(db.Boolean, default=False)



    # users = db.relationship("User", secondary=favorites,
    #                         back_populates="restaurants")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'neighborhood': self.neighborhood,
            'address': self.address,
            'cuisines': self.cuisines,
            'cost': self. cost,
            'operation_hours': self.operation_hours,
            'phone': self.phone,
            'description': self.description,
            'website': self.website,
            'preview_img': self.preview_img,
            'reviews': [review.to_dict() for review in self.reviews] if self.reviews else None,
            'total_num_reservations': len(self.reservations),
            'is_approved': self.is_approved
        }

    def __repr__(self):
        return f'''<Restaurant, id={self.id}, name={self.name},
        address ={self.address},
        cuisines={self.cuisines}, cost={self. cost},
        operation_hours={self.operation_hours},
        phone={self.phone},
        description={self.description}, preview_img={self.preview_img} >'''


class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=False)
    reservation_time = db.Column(db.DateTime, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    restaurant = db.relationship("Restaurant", back_populates="reservations")
    user = db.relationship("User", back_populates="reservations")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'reservation_time': self.reservation_time,
            'party_size': self.party_size,
            'restaurant': self.restaurant.to_dict(),
            'user': self.user.to_dict()
        }

    def __repr__(self):
        return f'''<Reservation, id={self.id}, user_id={self.user_id}, 
        restaruant_id={self.restaurant_id}, reservation_time={self.reservation_time}, 
        party_size={self.party_size}>'''


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=False)
    review = db.Column(db.String(2000), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    # created_at = db.Column(db.DateTime, nullable=False, index=False, default=datetime.utcnow)


    restaurant = db.relationship("Restaurant", back_populates="reviews")
    user = db.relationship("User", back_populates="reviews")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'review': self.review,
            'rating': self.rating,
            'user': self.user.to_dict()
        }

    def __repr__(self):
        return f'''<Review, id={self.id}, user_id={self.user_id}, 
        restaruant_id={self.restaurant_id}, review={self.review},
        rating={self.rating}>'''


class SavedRestaurant(db.Model):
    __tablename__ = "saved_restaurants"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=False)

    restaurants = db.relationship("Restaurant", back_populates="saved_restaurants")
    users = db.relationship("User", back_populates="saved_restaurants")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id
        }

class RestaurantManager(db.Model):
    __tablename__ = "restaurant_managers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    contact_number = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    is_approved = db.Column(db.Boolean, default=False)

    restaurants = db.relationship("Restaurant", backref="manager", lazy=True)

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'contact_number': self.contact_number,
            'is_approved': self.is_approved
        }

class MenuItem(db.Model):
    __tablename__ = "menu_items"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(6, 2), nullable=False)
    is_available = db.Column(db.Boolean, default=True)

    restaurant = db.relationship("Restaurant", backref="menu_items")

    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'is_available': self.is_available
        }

    def __repr__(self):
        return f'''<MenuItem id={self.id} name={self.name} price={self.price}>'''


