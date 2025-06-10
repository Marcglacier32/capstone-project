from werkzeug.security import generate_password_hash

# Change this to the password you want
password = "secret123"

# This generates a hashed version of the password
hashed = generate_password_hash(password)

# Show the result in the terminal
print("Your hashed password is:\n", hashed)
