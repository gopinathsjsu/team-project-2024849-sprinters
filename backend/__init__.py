import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User, SavedRestaurant
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .seeds import seed_commands
from .config import Config

# Initialize app
app = Flask(__name__, static_folder='../front-end/public', static_url_path='')

# Set up app config
app.config.from_object(Config)

# Initialize DB
db.init_app(app)
Migrate(app, db)

# Enable login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Register seed CLI commands
app.cli.add_command(seed_commands)

# Register blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
# Add other routes if needed

# ✅ Enable CSRF protection
csrf = CSRFProtect()
csrf.init_app(app)

# ✅ Enable CORS with credentials support
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "XSRF-Token"],
            "supports_credentials": True,
            "expose_headers": ["XSRF-Token"]
        }
    }
)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, XSRF-Token')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# ✅ Redirect HTTP to HTTPS in production
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

# ✅ Inject CSRF token into cookies
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'XSRF-TOKEN',  # Changed to match what your frontend expects
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'development' else False,
        samesite='Strict',
        httponly=False  # Needs to be accessible by JavaScript
    )
    return response

# ✅ API documentation route (optional)
@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }
    return route_list

# ✅ Frontend routes (for React dev and production)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

# ✅ Catch-all for unmatched routes
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/api/csrf/restore', methods=['GET'])
def restore_csrf():
    return {'message': 'CSRF token restored'}, 200
