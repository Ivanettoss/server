This is a real time radar that shows position of devices generating markers.


🚀 Project Setup and Execution Guide
📋 Prerequisites

Ensure the following are installed on your system:

    Node.js and npm

    GCC (C compiler)

    cJSON library (for C program; required on Linux/macOS)

To install cJSON on Linux:

sudo apt install libcjson-dev

📦 Installation (One-Time Setup)

    Clone the repository

Install Node.js dependencies if is the first time:

    npm install

🧱 Compile the C Client

Compile the packetSender.c source file:

gcc packetSender.c -o packetSender -lcjson

🔧 Running the System

    Open two separate terminal windows:

1 — Start the Node.js Server

node packetServer.js

This will launch:

    A TCP server on port 5000 to receive GPS packets from the C client.

    A WebSocket server on port 8080 to broadcast the data to frontend clients.

2 — Start the C Client

./packetSender

This will continuously generate and send new GPS coordinates (in JSON format) every second to the TCP server.
🌐 View the Data in the Browser

Open the index.html file in any modern web browser. For example:

xdg-open index.html    # On Linux
open index.html        # On macOS

The page will automatically connect to the WebSocket server and display real-time GPS data.

📁 Project Structure

packetSender.c       # C program that generates and sends GPS coordinates via TCP
packetServer.js      # Node.js server acting as TCP receiver and WebSocket broadcaster
index.html           # Frontend that receives and displays real-time data via WebSocket
README.md            # Setup instructions
