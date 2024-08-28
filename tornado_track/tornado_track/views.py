from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from tornado_track.utils.utils import get_data_from_postgres_api


def main(request):
    data_deposit = get_data_from_postgres_api()

    print(data_deposit)
    data = {
        "data_deposit": data_deposit,
    }
    return render(request, "index.html", data)
