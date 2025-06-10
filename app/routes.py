# app/routes.py
# Defines routes for the Proxima Centauri Flask backend, including HTML and API endpoints
from flask import Blueprint, render_template, redirect, url_for, flash, request, session, jsonify
from app.forms import SignupForm, LoginForm
from app.models import db, User, Group, Transaction
from app import bcrypt
from flask_login import login_user, current_user
from datetime import datetime

main = Blueprint('main', __name__)

# Root route for basic greeting
@main.route('/')
def hello():
    return "Hello Proxima Centauri!"

# Signup route for server-side rendered form
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
        return redirect(url_for('main.login'))

    return render_template('signup.html', form=form)

# Login route for server-side rendered form
@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session.permanent = True
            flash('Logged in successfully!', 'success')
            return redirect(url_for('main.hello'))
        else:
            flash('Invalid email or password', 'danger')
            return redirect(url_for('main.login'))

    return render_template('login.html')

# Logout route for server-side logout
@main.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.login'))

# Dashboard route, requires login
@main.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Please log in to access this page.', 'warning')
        return redirect(url_for('main.login'))
    return f"Welcome to your dashboard, user {session['user_id']}!"

# API route for login
@main.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        login_user(user)
        session['user_id'] = user.id
        session.permanent = True
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    return jsonify({'message': 'Invalid email or password'}), 401

# API route for signup
@main.route('/api/signup', methods=['POST'])
def api_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already registered.'}), 400
    existing_username = User.query.filter_by(username=username).first()
    if existing_username:
        return jsonify({'message': 'Username already taken.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Account created successfully'}), 201

# API route for creating a group
@main.route('/api/groups', methods=['POST'])
def api_create_group():
    if 'user_id' not in session:
        return jsonify({'message': 'Please log in to create a group'}), 401
    
    data = request.get_json()
    name = data.get('name')
    signatories = data.get('signatories')
    
    if not name or not signatories:
        return jsonify({'message': 'Missing required fields.'}), 400
    
    try:
        signatories = int(signatories)
        if signatories < 1:
            raise ValueError
    except ValueError:
        return jsonify({'message': 'Signatories must be a positive integer.'}), 400

    group = Group(name=name, signatories=signatories, user_id=session['user_id'])
    db.session.add(group)
    db.session.commit()
    
    return jsonify({'message': f'Group {name} created successfully', 'group_id': group.id}), 201

# API route for getting all groups
@main.route('/api/groups', methods=['GET'])
def api_get_groups():
    if 'user_id' not in session:
        return jsonify({'message': 'Please log in to view groups.'}), 401
    groups = Group.query.filter_by(user_id=session['user_id']).all()
    return jsonify([{
        'id': group.id,
        'name': group.name,
        'signatories': group.signatories
    } for group in groups]), 200

# API route for updating a group
@main.route('/api/groups/<int:id>', methods=['PUT'])
def api_update_group():
    if 'user_id' not in session:
        return jsonify({'message': 'Please log in to update a group.'}), 401
    
    group = Group.query.get_or_404(id)
    if group.user_id != session['user_id']:
        return jsonify({'message': 'Permission denied.'}), 403
    
    data = request.get_json()
    name = data.get('name')
    signatories = data.get('signatories')
    
    if not name or not signatories:
        return jsonify({'message': 'Missing required fields.'}), 400
    
    try:
        signatories = int(signatories)
        if signatories < 1:
            raise ValueError
    except ValueError:
        return jsonify({'message': 'Signatories must be a positive integer.'}), 400

    group.name = name
    group.signatories = signatories
    db.session.commit()
    
    return jsonify({'message': f'Group {name} updated successfully'}), 200

# API route for deleting a group
@main.route('/api/groups/<int:id>', methods=['DELETE'])
def api_delete_group():
    if 'user_id' not in session:
        return jsonify({'message': 'Please log in to delete a group.'}), 401
    
    group = Group.query.get_or_404(id)
    if group.user_id != session['user_id']:
        return jsonify({'message': 'Permission denied.'}), 403
    
    db.session.delete(group)
    db.session.commit()
    
    return jsonify({'message': f'Group {group.name} deleted successfully'}), 200

# API route for creating a transaction (deposit)
@main.route('/api/transactions', methods=['POST'])
def api_create_transaction():
    if 'user_id' not in session:
        return jsonify({'message': 'Please log in to create a transaction'}), 401
    
    data = request.get_json()
    amount = data.get('amount')
    group_id = data.get('group_id')
    transaction_type = data.get('type', 'deposit')
    
    if not amount or not group_id:
        return jsonify({'message': 'Missing required fields.'}), 400
    
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except ValueError:
        return jsonify({'message': 'Amount must be a positive number.'}), 400

    group = Group.query.get_or_404(group_id)
    if group.user_id != session['user_id']:
        return jsonify({'message': 'Permission denied.'}), 403

    transaction = Transaction(
        amount=amount,
        type=transaction_type,
        group_id=group_id,
        user_id=session['user_id']
    )
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({'message': f'{transaction_type.capitalize()} of {amount} recorded successfully'}), 201

# API route for getting all transactions
@main.route('/api/transactions', methods=['GET'])
def api_get_transactions():
    if 'user_id' not in session:
        return jsonify({'message': 'Please log in to view transactions'}), 401
    
    transactions = Transaction.query.filter_by(user_id=session['user_id']).all()
    return jsonify([{
        'id': tx.id,
        'amount': tx.amount,
        'type': tx.type,
        'group_id': tx.group_id,
        'timestamp': tx.timestamp.isoformat()
    } for tx in transactions]), 200

# API route for logout
@main.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200