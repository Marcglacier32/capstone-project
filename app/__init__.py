# app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    # Load config settings (e.g., secret key, database URI)
    app.config.from_object('app.config.Config')

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # Set login view (optional, used for redirecting unauthorized users)
    login_manager.login_view = 'main.login'  # 'main' = blueprint name, 'login' = route function name

    # Import models here to avoid circular imports
    from app.models import User

    # User loader callback
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Import and register blueprint with app
    from app.routes import main
    app.register_blueprint(main)

    return app
