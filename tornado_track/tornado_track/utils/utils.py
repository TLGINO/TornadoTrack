import requests

from tornado_track.utils.queries import DEPOSITS_QUERY  # , WITHDRAWALS_QUERY


def get_data_from_postgres_api(chain_id, desired_currency):
    endpoint = "http://hyperindex.lettry.xyz/v1/graphql"
    headers = {
        "Authorization": "testing",
        "Content-Type": "application/json",
    }

    query = DEPOSITS_QUERY
    variables = {"chainId": chain_id, "desiredCurrency": desired_currency}

    response = requests.post(
        endpoint,
        json={"query": query, "variables": variables},
        headers=headers,
    )
    response.raise_for_status()
    return response.json()
