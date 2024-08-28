from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "",
        views.main,
    ),
    path(
        "mainnet",
        views.main,
    ),
    path(
        "optimism",
        views.main,
    ),
]
