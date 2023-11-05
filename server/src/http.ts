import http from 'http';
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('private_keys/private.key'),
  cert: fs.readFileSync('private_keys/signed_cert.crt'),
};

const server = http.createServer((req, res) => {
  console.log("http received");
  console.log(req.url);

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
