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

## Deployment

### Prerequisites

Before deploying, ensure the following:

1. An AWS account is set up.
2. Basic knowledge of SSH and Linux commands.
3. Required files for the website are in this repository.
4. [AWS CLI](https://aws.amazon.com/cli/) installed locally (optional but recommended).

### Setup EC2 Instance

1. **Launch an EC2 Instance**:

   - Log in to the [AWS Management Console](https://aws.amazon.com/console/).
   - Go to **EC2 Dashboard** > **Launch Instance**.
   - Choose the AMI (Amazon Linux 2 is recommended).
   - Select the instance type (e.g., `t2.micro` for free-tier).
   - Configure instance details, storage, and tags as needed.
   - Create or select a security group allowing HTTP (port 80) and SSH (port 22).
   - Launch the instance and download the key pair (e.g., `my-key.pem`).

2. **Connect to the Instance**:
   - Open a terminal and navigate to the directory where the key pair is stored.
   - Run the following command to connect via SSH:
     ```bash
     ssh -i my-key.pem ec2-user@<EC2-Public-IP>
     ```

### Configuring the Environment

1. **Update the Package Manager**:

   ```bash
   sudo yum update -y
   ```

2. **Install a Web Server (e.g., Nginx or Apache)**:

   - For Nginx:
     ```bash
     sudo amazon-linux-extras install nginx1 -y
     sudo systemctl start nginx
     sudo systemctl enable nginx
     ```
   - For Apache:
     ```bash
     sudo yum install httpd -y
     sudo systemctl start httpd
     sudo systemctl enable httpd
     ```

3. **Install Additional Dependencies** (if needed for your website):
   ```bash
   sudo yum install git nodejs npm -y  # Example: Git, Node.js, and npm
   ```

---

### Deploying the Website

1. **Clone the Repository to the Instance**:

   ```bash
   git clone https://github.com/D33102/Khunlook.git
   cd Khunlook
   ```

2. **Place Files in the Web Directory**:

   - For Nginx:
     ```bash
     sudo cp -r * /usr/share/nginx/html/
     sudo systemctl restart nginx
     ```
   - For Apache:
     ```bash
     sudo cp -r * /var/www/html/
     sudo systemctl restart httpd
     ```

3. **Adjust File Permissions**:
   ```bash
   sudo chmod -R 755 /usr/share/nginx/html/  # For Nginx
   sudo chmod -R 755 /var/www/html/         # For Apache
   ```

---

### Accessing the Website

- Locate your EC2 instance's **Public IPv4 address** in the AWS Management Console.
- Open a web browser and navigate to `http://<EC2-Public-IP>`.

---

### Troubleshooting

1. **Check Service Status**:

   ```bash
   sudo systemctl status nginx   # For Nginx
   sudo systemctl status httpd   # For Apache
   ```

2. **Verify Security Group Rules**:

   - Ensure inbound rules allow HTTP (port 80) and SSH (port 22).

3. **Inspect Logs**:
   - For Nginx:
     ```bash
     sudo tail -f /var/log/nginx/access.log
     sudo tail -f /var/log/nginx/error.log
     ```
   - For Apache:
     ```bash
     sudo tail -f /var/log/httpd/access_log
     sudo tail -f /var/log/httpd/error_log
     ```
