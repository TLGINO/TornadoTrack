#!/bin/sh

cd tornado_track

# DB wipe
python3 manage.py makemigrations tornado_track
python3 manage.py migrate tornado_track

# Run the server
python3 manage.py runserver 8080