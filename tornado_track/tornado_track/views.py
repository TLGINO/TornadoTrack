from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from tornado_track.utils.utils import get_data_from_postgres_api


def main(request):
    data_mainnet_deposit = get_data_from_postgres_api(endpoint="mainnet_deposit")
    data_mainnet_withdrawal = get_data_from_postgres_api(endpoint="mainnet_withdrawal")

    data = {
        "data_mainnet_deposit": data_mainnet_deposit,
        "data_mainnet_withdrawal": data_mainnet_withdrawal,
    }
    return render(request, "index.html", data)
