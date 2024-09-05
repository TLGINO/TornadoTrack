import json
from datetime import datetime

import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render

from tornado_track.utils.utils import (
    format_time_ago,
    get_contract_storage_info,
    get_deposits,
    get_withdrawals,
)


def transform_timestamp(timestamp):
    return timestamp.strftime("%Y-%m-%d")


def main(request):
    chain_id = request.GET.get("id", 1)
    currency = request.GET.get("currency", "ETH")
    print(f"Chain ID: {chain_id} \nCurrency: {currency}")

    currency_map = {
        "V_0_1": 0.1,
        "V_1": 1,
        "V_10": 10,
        "V_100": 100,
        "V_1000": 1000,
        "V_10000": 10000,
        "V_100000": 100000,
        "V_500": 500,
        "V_5000": 5000,
        "V_50000": 50000,
        "V_500000": 500000,
        "V_5000000": 5000000,
    }

    data_deposit = get_deposits(chain_id, currency)["data"]["TornadoCash_ETH_Deposit"]
    data_withdrawal = get_withdrawals(chain_id, currency)["data"][
        "TornadoCash_ETH_Withdrawal"
    ]

    data_tornado = {
        "data_deposit": data_deposit,
        "data_withdrawal": data_withdrawal,
    }

    processed_data = {}

    for name, data in data_tornado.items():
        df = pd.DataFrame(data)
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s")
        df_latest = df.nlargest(10, ["timestamp"])

        now = datetime.now()
        df_latest["time_ago"] = df_latest["timestamp"].apply(lambda x: now - x)
        df_latest["timestamp"] = df_latest["time_ago"].apply(format_time_ago)
        df_latest.drop(columns=["time_ago"], inplace=True)
        df_latest["amount"] = df_latest["amount"].map(currency_map)
        
        processed_data[f"{name}_latest"] = df_latest.to_dict(orient="records")

        df["timestamp"] = df["timestamp"].apply(transform_timestamp)

        df = df.sort_values(by="timestamp")
        result_df = df.groupby(["amount", "timestamp"]).size().reset_index(name="count")

        result_df["amount"] = result_df["amount"].map(currency_map)

        all_dates = sorted(result_df["timestamp"].unique())
        all_amounts = sorted(result_df["amount"].unique())

        idx = pd.MultiIndex.from_product(
            [all_dates, all_amounts], names=["timestamp", "amount"]
        )
        full_df = pd.DataFrame(index=idx).reset_index()
        full_df = pd.merge(full_df, result_df, on=["timestamp", "amount"], how="left")
        full_df["count"] = full_df["count"].fillna(0)

        grouped_data = (
            full_df.groupby("amount")
            .apply(
                lambda x: {
                    "timestamps": x["timestamp"].tolist(),
                    "counts": x["count"].tolist(),
                }
            )
            .to_dict()
        )

        processed_data[name] = {"labels": all_dates, "datasets": grouped_data}

    with open("tornado_track/cryptos.json") as f:
        data = json.load(f)[str(chain_id)][currency]
        
        data_parsed = [
            {"amount": key, "addr":val, "stored": get_contract_storage_info(str(chain_id), currency, val)}
            for key, val in data.items()
        ]
        processed_data["contract_storage"] = data_parsed
    
    processed_data["currency"] = currency
    processed_data["chain_id"] = chain_id

    return render(request, "index.html", processed_data)



def get_all_chains(request):
    with open("tornado_track/cryptos.json") as f:
        data = json.load(f)
        return JsonResponse(data)
    return JsonResponse({})



def test(request):
    return render(request, "test.html")
