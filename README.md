# Imaginepy Frontend WebUI

## The API backend is currently dead :(

A user-friendly and intuitive web application interface that allows you to seamlessly generate creative images using the power of AI. This web application utilizes the [Imaginepy](https://github.com/ItsCEED/Imaginepy) library by [@ItsCEED](https://github.com/ItsCEED/Imaginepy) for AI image generation.

![Web capture_16-6-2023_19718_imagine](https://github.com/iGerman00/imagine-webui/assets/36676880/aaf636f2-a136-43c9-9403-239bd611e142)

- **Friendly UI**
- **Lightweight**
- **Dynamically fetch styles and their thumbnails**
- **Gets options directly from the library**

## 📋 Requirements

- Python 3.7+
- Virtual environment (python venv)

## 🚀 Quick Setup

1. Clone the repository:

```bash
git clone https://github.com/iGerman00/imagine-webui.git
cd imagine-webui
```

2. Create and activate the virtual environment:

```bash
# Create a Python virtual environment named '.venv'
python3 -m venv .venv
# Activate the virtual environment
source .venv/bin/activate
```

3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

4. Run the application using Gunicorn:

```bash
gunicorn --workers 1 --bind localhost:3000 -m 007 wsgi:app
```

The application should now be running and accessible at `http://localhost:3000`.

## 📦 Deploy as a systemd service

To run the AI Image Generation WebUI automatically at system startup and manage it using systemd, follow these steps:

1. Create a new systemd service file:

```bash
sudo nano /etc/systemd/system/imagine-webui.service
```

2. Copy the following content into the new service file, making sure to replace `/path/to/imagine-webui` with the actual path to the cloned repository:

```ini
[Unit]
Description=Gunicorn instance to serve Imagine WebUI
After=network.target

[Service]
User=your_username
Group=your_group
WorkingDirectory=/path/to/imagine-webui
Environment="PATH=/path/to/imagine-webui/.venv/bin"
ExecStart=/path/to/imagine-webui/.venv/bin/gunicorn --workers 1 --bind localhost:3000 -m 007 wsgi:app

[Install]
WantedBy=multi-user.target
```

3. Reload the systemd configuration:

```bash
sudo systemctl daemon-reload
```

4. Enable and start the service:

```bash
sudo systemctl enable imagine-webui
sudo systemctl start imagine-webui
```

The AI Image Generation WebUI should now be running in the background, managed by systemd, and accessible at `http://localhost:3000`.

## 🔄 Reverse Proxy with Caddy

To serve the AI Image Generation WebUI behind a reverse proxy using [Caddy](https://caddyserver.com/), follow these steps:

### Install Caddy

Please follow the official [installation instructions](https://caddyserver.com/docs/install) according to your operating system.

### Configure Caddy

1. Edit your Caddyfile in your preferred location (e.g., `/etc/caddy/Caddyfile`).

```bash
sudo nano /etc/caddy/Caddyfile
```

2. Copy and paste the following configuration into the Caddyfile, making sure to replace `imagine.yourdoma.in` with your actual domain:

```
imagine.yourdoma.in {
    reverse_proxy http://localhost:3000
}
```
