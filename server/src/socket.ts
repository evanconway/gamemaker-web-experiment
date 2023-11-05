import net from "net";

const socketServer = net.createServer((socket) => {
    console.log("Client connected");
    socket.write("connection established");

    socket.on("data", (data) => {
        console.log(`socket received: "${data.toString()}"`);
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log(`Socket Error: ${error.message}`);
    });
});

socketServer.on("error", (error) => {
    console.log(`Server Error: ${error.message}`);
});

const port = 5000;

export const startSocketServer = () => {
    socketServer.listen(port, () => {
        console.log(`TCP socket server is running on port: ${port}`);
    });
};

export default startSocketServer;
