import json
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
    # endpoint = "http://localhost:8080/v1/graphql"

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


def get_contract_storage_info(chain_id, currency, addr):
    url = get_url(chain_id, currency, addr)
    response = requests.get(url).text

    res = int(json.loads(response)["result"])
    if currency in ["ETH", "DAI", "MATIC", "AVAX", "BNB", "XDAI"]:
        res = res // 10**18
    elif currency in ["USDC", "USDT"]:
        res = res // 10**6
    elif currency in ["CDAI", "WBTC"]:
        res = res // 10**8
    return res


def get_url(chain_id, currency, addr):
    url = ""
    if chain_id == "1":
        url = f"https://api.etherscan.io/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=FIATAMNERIDMX5I9GW8S6YXFZ921D1YYBD"

        if currency != "ETH":
            contract_addr = {
                "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "CDAI": "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
                "USDC": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "USDT": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "WBTC": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
            }[currency]

            url = f"https://api.etherscan.io/api?chaindid={chain_id}&module=account&action=tokenbalance&contractaddress={contract_addr}&address={addr}&tag=latest&apikey=FIATAMNERIDMX5I9GW8S6YXFZ921D1YYBD"

    elif chain_id == "5":
        url = f"https://api-goerli.etherscan.io/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=PDANBSZU2XWSZAFMQG3EBUX3NRECWBX59E"

        if currency != "ETH":
            contract_addr = {
                "DAI": "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
                "CDAI": "0x822397d9a55d0fefd20F5c4bCaB33C5F65bd28Eb",
                "USDC": "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
                "USDT": "0xb7FC2023D96AEa94Ba0254AA5Aeb93141e4aad66",
                "WBTC": "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
            }[currency]

            url = f"https://api-goerli.etherscan.io/api?chaindid={chain_id}&module=account&action=tokenbalance&contractaddress={contract_addr}&address={addr}&tag=latest&apikey=PDANBSZU2XWSZAFMQG3EBUX3NRECWBX59E"

    elif chain_id == "56":
        url = f"https://api.bscscan.com/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=SNINE1MYTA4W1WWM76N9FIXWYW5GZ9H9VN"

    elif chain_id == "100":
        url = f"https://api.gnosisscan.io/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=X79HVW3KUJ8BV7458ISDSVVJH1PU2WSFRM"
    elif chain_id == "137":
        url = f"https://api.polygonscan.com/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=TS4FGFJQ6ZGR788ZIU6JIPZN7ZPUHMHWQ1"
    elif chain_id == "42161":
        url = f"https://api.arbiscan.io/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=E5HYKDHPXNUGTW498JITE4NVEZPURM7RR1"
    elif chain_id == "43114":
        url = f"https://api.snowscan.xyz/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=3W6ZGFZ5JUMTAE2KFX5NKH7GS1NBHINI7W"
    elif chain_id == "10":
        url = f"https://api-optimistic.etherscan.io/api?chaindid={chain_id}&module=account&action=balance&address={addr}&tag=latest&apikey=A7B98Q2F6SIM9XFYI198ZNN87D8EEIUDM9"

    return url
