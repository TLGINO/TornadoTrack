from functools import wraps

import requests

from tornado_track.utils.queries import DEPOSITS_QUERY, WITHDRAWALS_QUERY


def execute_query(query):
    def decorator(func):
        @wraps(func)
        def wrapper(chain_id, desired_currency):
            return get_data_from_postgres_api(chain_id, desired_currency, query)

        return wrapper

    return decorator


@execute_query(DEPOSITS_QUERY)
def get_deposits(chain_id, desired_currency):
    pass  # Handled by the decorator


@execute_query(WITHDRAWALS_QUERY)
def get_withdrawals(chain_id, desired_currency):
    pass  # Handled by the decorator


def get_data_from_postgres_api(chain_id, desired_currency, query):
    endpoint = "http://hyperindex.lettry.xyz/v1/graphql"
    headers = {
        "Authorization": "testing",
        "Content-Type": "application/json",
    }

    variables = {"chainId": chain_id, "desiredCurrency": desired_currency}

    response = requests.post(
        endpoint,
        json={"query": query, "variables": variables},
        headers=headers,
    )
    response.raise_for_status()
    return response.json()


def format_time_ago(td):
    if td.days > 0:
        if td.days == 1:
            return f"{td.days} day ago"
        else:
            return f"{td.days} days ago"
    elif td.seconds > 3600:
        hours = td.seconds // 3600
        if hours == 1:
            return f"{hours} hour ago"
        else:
            return f"{hours} hours ago"
    elif td.seconds > 60:
        minutes = td.seconds // 60
        if minutes == 1:
            return f"{minutes} minute ago"
        else:
            return f"{minutes} minutes ago"
    else:
        return "Just now"
