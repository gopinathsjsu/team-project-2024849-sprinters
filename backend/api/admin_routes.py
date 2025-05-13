from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from backend.models.model import Restaurant, Reservation, User, db
from datetime import datetime, timedelta
from sqlalchemy import func
from functools import wraps


admin_routes = Blueprint("admin", __name__, url_prefix="/api/admin")


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"error": "Forbidden"}), 403
        return f(*args, **kwargs)

    return decorated_function


# GET /api/admin/restaurants
@admin_routes.route("/restaurants", methods=["GET"])
@login_required
@admin_required
def get_all_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify([r.to_dict() for r in restaurants])


# PATCH /api/admin/approve/<restaurant_id>
@admin_routes.route("/approve/<int:restaurant_id>", methods=["PATCH"])
@login_required
@admin_required
def approve_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    restaurant.is_approved = True
    db.session.commit()
    return jsonify(restaurant.to_dict())


# DELETE /api/admin/delete/<restaurant_id>
@admin_routes.route("/delete/<int:restaurant_id>", methods=["DELETE"])
@login_required
@admin_required
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurant deleted"})


# GET /api/admin/analytics
@admin_routes.route("/analytics", methods=["GET"])
@login_required
@admin_required
def reservation_analytics():
    last_month = datetime.utcnow() - timedelta(days=30)

    # Daily reservation counts
    daily_stats = db.session.query(
        func.date(Reservation.created_at),
        func.count(Reservation.id)
    ).filter(
        Reservation.created_at >= last_month
    ).group_by(
        func.date(Reservation.created_at)
    ).order_by(func.date(Reservation.created_at)).all()

    # Total counts
    total_reservations = db.session.query(func.count(Reservation.id)).filter(
        Reservation.created_at >= last_month
    ).scalar()

    total_users = db.session.query(func.count(User.id)).scalar()
    total_restaurants = db.session.query(func.count(Restaurant.id)).scalar()

    # Average party size
    avg_party_size = db.session.query(func.avg(Reservation.party_size)).filter(
        Reservation.created_at >= last_month
    ).scalar()

    # Top restaurant name
    top_restaurant = db.session.query(
        Reservation.restaurant_id,
        func.count(Reservation.id)
    ).filter(
        Reservation.created_at >= last_month
    ).group_by(
        Reservation.restaurant_id
    ).order_by(func.count(Reservation.id).desc()).first()

    top_restaurant_name = None
    if top_restaurant:
        restaurant = Restaurant.query.get(top_restaurant[0])
        top_restaurant_name = restaurant.name if restaurant else None

    # Top 5 restaurants by reservation count
    top5 = db.session.query(
        Restaurant.name,
        func.count(Reservation.id).label("count")
    ).join(Reservation).filter(
        Reservation.created_at >= last_month
    ).group_by(Restaurant.name).order_by(func.count(Reservation.id).desc()).limit(5).all()

    top5_restaurants = [{"name": name, "count": count} for name, count in top5]

    # Reservations by day of week
    day_of_week = db.session.query(
        func.to_char(Reservation.created_at, 'Day'),
        func.count(Reservation.id)
    ).filter(
        Reservation.created_at >= last_month
    ).group_by(
        func.to_char(Reservation.created_at, 'Day')
    ).all()

    day_of_week_stats = [{"day": day.strip(), "count": count} for day, count in day_of_week]

    # User booking frequency
    user_booking_counts = db.session.query(
        Reservation.user_id,
        func.count(Reservation.id)
    ).group_by(Reservation.user_id).all()

    booking_freq = {"1-time": 0, "2-5 times": 0, "6+ times": 0}
    for _, count in user_booking_counts:
        if count == 1:
            booking_freq["1-time"] += 1
        elif 2 <= count <= 5:
            booking_freq["2-5 times"] += 1
        else:
            booking_freq["6+ times"] += 1

    booking_distribution = [{"label": k, "count": v} for k, v in booking_freq.items()]

    return jsonify({
        "daily": [{"date": str(d), "count": c} for d, c in daily_stats],
        "total_reservations": total_reservations,
        "total_users": total_users,
        "total_restaurants": total_restaurants,
        "average_party_size": round(avg_party_size or 0, 2),
        "top_restaurant": top_restaurant_name,
        "top5_restaurants": top5_restaurants,
        "day_of_week": day_of_week_stats,
        "booking_frequency": booking_distribution
    })
