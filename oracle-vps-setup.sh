#!/bin/bash
# ==============================================================================
# 🛡️ MARGINGUARD - ORACLE CLOUD ALWAYS FREE AUTOMATED SETUP & SECURITY HARDENING
# ==============================================================================
# Operating System: Ubuntu 24.04 LTS (ARM64 Ampere / x86_64)
# Specifications: 4 vCPUs, 24 GB RAM, 200 GB SSD NVMe (0.00$ / Month Forever)
# ==============================================================================

set -e

echo "🚀 [1/6] Updating System Packages & Security Patches..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw fail2ban unattended-upgrades htop ca-certificates gnupg

echo "🐳 [2/6] Installing Docker Engine & Docker Compose..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER

echo "🔒 [3/6] Configuring UFW Hardened Firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH Port'
sudo ufw allow 80/tcp comment 'HTTP Web'
sudo ufw allow 443/tcp comment 'HTTPS Web'
sudo ufw allow 5680/tcp comment 'MarginGuard Vitrine'
sudo ufw allow 5681/tcp comment 'InboxGuard'
sudo ufw allow 5682/tcp comment 'Winnow'
sudo ufw allow 5683/tcp comment 'Revenue Rescue'
sudo ufw --force enable

echo "🛡️ [4/6] Activating Fail2ban Anti-Brute Force Protection..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

echo "📁 [5/6] Deploying MarginGuard 24/7 Docker Cluster & Self-Healing Guardian..."
mkdir -p /opt/marginguard
cd /opt/marginguard

if [ ! -d ".git" ]; then
  git clone https://github.com/Nidou-Cmd/marginguard-vitrine.git .
fi

echo "🚀 [6/6] Launching 24/7 Self-Healing Guardian & Docker Services..."
sudo docker compose up -d --build

echo "=============================================================================="
echo "✅ MARGINGUARD ORACLE CLOUD ALWAYS FREE INSTALLATION COMPLETED SUCCESSFULLY!"
echo "🛡️ 24/7 Self-Healing Guardian is active and monitoring all endpoints."
echo "=============================================================================="
