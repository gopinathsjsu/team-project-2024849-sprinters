from flask import Blueprint, jsonify, session, request
from backend.models import User, db
from backend.forms import LoginForm
from backend.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__, url_prefix="/api/auth")


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['GET','POST'])
def login():

    # if request.method == 'GET':
    #     return jsonify({"message": "Login route is reachable via GET"}), 200
    # if request.method == 'POST':
    #     # print("LOGIN POST ROUTE ENTERED") # Check Render logs
    #     # print(f"Request headers: {request.headers}")
    #     # print(f"Request cookies: {request.cookies}")
    #     # print(f"Request form data: {request.form}")
    #     # print(f"Request JSON data: {request.get_json(silent=True)}")
    #     return jsonify({"message": "Login POST request received successfully!"}), 200
    # return jsonify({"error": "Method not handled correctly in debug"}), 500

    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            first_name=form.data['first_name'],
            last_name=form.data['last_name'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
