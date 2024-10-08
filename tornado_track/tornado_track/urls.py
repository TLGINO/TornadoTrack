from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "",
        views.main,
    ),
    path("mainnet", views.main, name="main"),
    path(
        "optimism",
        views.main,
    ),
    path("cryptos", views.get_all_chains, name="cryptos"),
    path("test", views.test, name="test"),
]
