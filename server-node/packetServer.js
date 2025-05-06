// import the tcp module and the web socket 
const net = require('net'); 
const WebSocket = require('ws'); 

// define the backend and frontend gates
const TCP_PORT = 5000;  
const WS_PORT = 8080;   

// define an array to keep the connected clients (it contains websocket object)
// used to manage broadcast or single connections
let wsClients = []; 

// create the web socket server on port 8080
const wss = new WebSocket.Server({ port: WS_PORT });


// everytime a websocket client is connected 
wss.on('connection', ws => {

    console.log('WebSocket client connected');
    wsClients.push(ws);

    ws.on('close', () => {

        // create a new array without the close ws client
        wsClients = wsClients.filter(client => client !== ws);
        console.log('WebSocket client disconnected');
    });
});



// everytime a new connection is created, we assign a socket to it 
const tcpServer = net.createServer(socket => {

    console.log('TCP connection coming');

    // for each socket, we listen his datas
    socket.on('data', buffer => {

        // convert the the buffer into string
        const rawData = buffer.toString().trim();
        try {

            // check if the json sent by BE is valid
            const data = JSON.parse(rawData); 
            console.log('data received:', data);

            // send the json to each connected ws client 
            wsClients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (err) {
            console.error('Error during JSON parsing :', rawData);
        }
    });
    socket.on('end', () => {
        console.log('TCP connection closed');
    });
    socket.on('error', err => {
        console.error('TCP error:', err.message);
    });
});

// start the tcp server and log both servers (tcp and ws) 
tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP Server listening on  ${TCP_PORT}`);
});
console.log(`WebSocket Server listening on ${WS_PORT}`);
