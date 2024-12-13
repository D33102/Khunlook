# Khunlook

Individual Study III (2110391)

## Requirements

To run this project, you will need to have the following installed on your machine:

- **Docker**: For containerization.
- **Node.js**: To run the application.

## Getting Started

Follow these instructions to set up and run the project using Docker.

### Clone the Repository

```bash
git clone https://github.com/D33102/Khunlook.git
```

### Go to the directory

```bash
cd Khunlook
```

### Add Following Files

- **.env**: a centralized location to store configuration settings for your project.

### Run Docker

```bash
docker-compose up --build -d
```

## Deployment Guide on Vultr using Debian

### Prerequisites

1. **Vultr Account**: Ensure you have an active Vultr account.
2. **Server Setup**:
   - A deployed Debian server on Vultr.
   - SSH access to the server.
3. **Application Code**:
   - Codebase ready for deployment (Node.js).

### Steps for Deployment

#### 1. Connect to Your Vultr Server

1. Get the server's public IP address and SSH credentials from the Vultr dashboard.
2. Use the following command to connect:

```bash
   ssh root@<SERVER_IP>
```

#### 2. Install dependencies

```bash
   sudo apt update
```

1. Install git

```bash
   sudo apt install git
```

2. Install docker

```bash
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```bash
   sudo apt install -y docker-ce docker-ce-cli containerd.io
```

3. Install docker compose

```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/<VERSION>/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```bash
   sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Clone the project using git

```bash
   git clone https://<TOKEN>@<HOST>/<USERNAME>/<REPO>.git
```

#### 4. Run the server

1. Run frontend

```bash
   cd khunlook-indiv-frontend
```

```bash
   docker compose up --build -d
```

2. Run backend

```bash
   cd Khunlook
```

```bash
   docker compose up --build -d
```
