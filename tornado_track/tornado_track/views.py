from django.http import HttpResponse
from django.shortcuts import render


def main(request):
    return HttpResponse("Hello World")


def page(request):
    return render(request, "index.html", {})
