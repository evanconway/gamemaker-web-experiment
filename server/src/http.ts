import http from 'http';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

const port = 8000;

const startHttpServer = () => {
    server.listen(port);
    console.log(`Http server is running on port: ${port}`);
};

export default startHttpServer;
