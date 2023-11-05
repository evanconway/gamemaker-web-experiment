import http from 'http';
import https from 'https';
import fs from 'fs';

const options = {
	key: fs.readFileSync('private_keys/private.key'),
	cert: fs.readFileSync('private_keys/signed_cert.crt'),
};

const server = http.createServer((req, res) => {
	console.log("http received");
	let body = '';

	res.writeHead(200, { 'Content-Type': 'application/json' });

	req.on('data', (chunk) => {
		body += chunk;
	});
	req.on('end', () => {
		console.log(body);
		res.write('OK'); 
		res.end(JSON.stringify({ data: 'Hello World!' }));
	});
});

const port = 8000;

const startHttpServer = () => {
	server.listen(port);
	console.log(`Http server is running on port: ${port}`);
};

export default startHttpServer;
