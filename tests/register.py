import requests

API_URL = "http://localhost:8000/api/auth/register"
USER_COUNT = 100

def create_user(index):
    payload = {
        "username": f"testuser{index}",
        "email": f"testuser{index}@aaw.com",
        "password": "Testuser123",
        "full_name": "test user",
        "address": "test user address",
        "phone_number": "0123456789"
    }
    response = requests.post(API_URL, json=payload)
    if response.status_code == 201:
        print(f"User {payload['username']} created successfully.")
    else:
        print(f"Failed to create user {payload['username']}: {response.text}")

def main():
    for i in range(1, USER_COUNT + 1):
        create_user(i)

if __name__ == "__main__":
    main()