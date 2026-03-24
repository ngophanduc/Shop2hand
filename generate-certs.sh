#!/bin/bash

# Create certs directory if it doesn't exist
mkdir -p certs

# Generate a self-signed certificate
# Valid for 365 days
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout certs/selfsigned.key \
    -out certs/selfsigned.crt \
    -subj "/C=VN/ST=Hanoi/L=Hanoi/O=Shop2hand/OU=Dev/CN=passgiay.shop"

echo "Self-signed certificate generated in ./certs/"
