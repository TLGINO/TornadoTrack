from datetime import datetime
import json
import pandas as pd
from django.shortcuts import render

from tornado_track.utils.utils import get_data_from_postgres_api
from django.http import JsonResponse


def transform_timestamp(timestamp):
    return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")


def main(request):

    chain_id = request.GET.get("id", 1)
    currency = request.GET.get("currency", "ETH")
    print(f"Chain ID: {chain_id} \nCurrency: {currency}")
    # [TODO] remove this
    # return render(request, "index.html", {})

    data_deposit = get_data_from_postgres_api(chain_id, currency)
    data_deposit_ls = data_deposit["data"]["TornadoCash_ETH_Deposit"]

    df = pd.DataFrame(data_deposit_ls)
    df["timestamp"] = df["timestamp"].astype(int)
    df["timestamp"] = df["timestamp"].apply(transform_timestamp)

    df = df.sort_values(by="timestamp")

    result_df = df.groupby(["amount", "timestamp"]).size().reset_index(name="count")

    result_df["amount"] = result_df["amount"].map(
        {
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
    )

    # On some days, not all mappings are used, instead of appearing as 0, the value is simply non-existant
    # Below is fix to add 0 to all dates / amounts

    # Create a complete range of dates and amounts
    all_dates = sorted(result_df["timestamp"].unique())
    all_amounts = sorted(result_df["amount"].unique())

    # Create a multi-index DataFrame with all combinations of dates and amounts
    idx = pd.MultiIndex.from_product(
        [all_dates, all_amounts], names=["timestamp", "amount"]
    )
    full_df = pd.DataFrame(index=idx).reset_index()

    # Merge with the result DataFrame to ensure all combinations are present
    full_df = pd.merge(full_df, result_df, on=["timestamp", "amount"], how="left")

    full_df["count"] = full_df["count"].fillna(0)

    result_dict = full_df.to_dict(orient="dict")

    data = {
        "result_dict": result_dict,
        "currency": currency,
    }
    return render(request, "index.html", data)


def get_all_chains(request):
    with open("tornado_track/cryptos.json") as f:
        data = json.load(f)
        return JsonResponse(data)
    return JsonResponse({})
