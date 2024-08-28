import requests


def get_data_from_postgres_api(endpoint):
    url = f"http://localhost:8080/api/rest/{endpoint}"
    headers = {
        "Authorization": "testing",
        "Content-Type": "application/json",
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        data = response.json()
        return data

    except requests.exceptions.RequestException as e:
        print(f"Error querying PostgreSQL API: {e}")
        return None
