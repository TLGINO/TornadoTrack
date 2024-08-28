from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from tornado_track.utils.utils import get_data_from_postgres_api
import pandas as pd
from datetime import datetime


def transform_timestamp(timestamp):
    return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")


def main(request):
    data_deposit = get_data_from_postgres_api()
    data_deposit_ls = data_deposit["data"]["TornadoCash_ETH_Deposit"]

    # Testing
    data_deposit_ls = data_deposit_ls  # [:1000]
    print((data_deposit_ls))

    df = pd.DataFrame(data_deposit_ls)
    df["timestamp"] = df["timestamp"].astype(int)
    df["timestamp"] = df["timestamp"].apply(transform_timestamp)

    print(df)

    result_df = df.groupby(["amount", "timestamp"]).size().reset_index(name="count")

    result_df["amount"] = result_df["amount"].map(
        {
            "V_0_1": 0.1,
            "V_1": 1,
            "V_10": 10,
            "V_100": 100,
        }
    )

    print(result_df)
    result_dict = result_df.to_dict(orient="list")

    data = {
        "result_dict": result_dict,
    }
    return render(request, "index.html", data)
