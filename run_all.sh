#!/bin/sh

cd tornado_track

# Starting redis server for caching
docker run -p 6379:6379 -d redis

# DB wipe
python3 manage.py makemigrations tornado_track
python3 manage.py migrate tornado_track

# Run the server
python3 manage.py runserver 0.0.0.0:8000

# python manage.py runsslserver 0.0.0.0:8000 --certificate certs/cert.pem --key certs/privkey.pem

