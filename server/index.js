const net = require("net");

const server = net.createServer((socket) => {
    console.log("Client connected");
    socket.write("connection established");

    socket.on("data", (data) => {
        console.log("data received");
        console.log(data);
        //const strData = data.toString();
        //console.log(`Received: ${strData}`);
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log(`Socket Error: ${error.message}`);
    });
});

server.on("error", (error) => {
    console.log(`Server Error: ${error.message}`);
});

const port = 5000;

server.listen(port, () => {
    console.log(`TCP socket server is running on port: ${port}`);
});
