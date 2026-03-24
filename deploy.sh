#!/bin/bash

# Configuration
VPS_IP="157.10.53.26"
VPS_USER="root"
PROJECT_DIR="/root/shop2hand"

echo "Deploying Shop2hand to VPS ($VPS_IP)..."

# Create project directory on VPS
ssh $VPS_USER@$VPS_IP "mkdir -p $PROJECT_DIR"

# Rsync files to VPS (excluding node_modules and target)
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude '.git' --exclude '.mvn/wrapper' \
    ./ $VPS_USER@$VPS_IP:$PROJECT_DIR/

# SSH and run docker-compose
ssh $VPS_USER@$VPS_IP "cd $PROJECT_DIR && \
    mkdir -p /var/www/certbot && \
    docker-compose up --build -d"

echo "Deployment finished! Visit https://passgiay.shop to check."
