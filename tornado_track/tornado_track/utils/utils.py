import requests
from tornado_track.utils.queries import DEPOSITS_QUERY  # , WITHDRAWALS_QUERY


def get_data_from_postgres_api():
    endpoint = "http://localhost:8080/v1/graphql"
    headers = {
        "Authorization": "testing",
        "Content-Type": "application/json",
    }

    query = DEPOSITS_QUERY
    variables = {"chainId": 1, "currencyList": ["ETH"]}

    response = requests.post(
        endpoint,
        json={"query": query, "variables": variables},
        headers=headers,
    )
    response.raise_for_status()
    return response.json()
