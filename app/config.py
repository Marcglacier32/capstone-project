# app/config.py

import os

class Config:
    # Secret key for sessions and security (stored in .env)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'

    # Database connection URL (also stored in .env)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///proxima.db'

    # Optional: Turn off a warning we don’t need
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Optional: Show detailed error messages (only in development)
    DEBUG = True
