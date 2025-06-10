from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from functools import wraps  # ✅ Add this
from app.forms import SignupForm
from app.models import db, User
from app import bcrypt  # Required for password hashing


main = Blueprint('main', __name__)

@main.route('/')
def hello():
    return "Hello Proxima Centauri!"

@main.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        existing_user = User.query.filter_by(email=form.email.data).first()
        if existing_user:
            flash('Email already registered. Please log in instead.', 'danger')
            return redirect(url_for('main.signup'))

        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_user = User(
            username=form.username.data,
            email=form.email.data,
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        flash('Account created successfully!', 'success')
        return redirect(url_for('main.login'))  # Redirect to login page after signup

    return render_template('signup.html', form=form)

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session.permanent = True  # optional: make session permanent
            flash('Logged in successfully!', 'success')
            return redirect(url_for('main.hello'))
        else:
            flash('Invalid email or password', 'danger')
            return redirect(url_for('main.login'))

    return render_template('login.html')

@main.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.login'))

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('main.login'))
        return f(*args, **kwargs)
    return decorated_function

@main.route('/dashboard')
@login_required
def dashboard():
    return f"Welcome to your dashboard, user {session['user_id']}!"
