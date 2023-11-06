import http from 'http';
import https from 'https';
import fs from 'fs';
import game from './game';

const port = 8000;

// const options = {
// 	key: fs.readFileSync('private_keys/private.key'),
// 	cert: fs.readFileSync('private_keys/signed_cert.crt'),
// };

const server = http.createServer((req, res) => {
	console.log("http received: ", req.url);
	let body = '';

	req.on('data', (chunk) => {
        body += chunk;
	});

	const resObj: Record<string, string | number> = {};

	if (req.url === '/start') {
		const playerId = game.addPlayer();
		resObj["player_id"] = playerId;
	}

	res.writeHead(200, {
		'access-control-allow-origin': '*',
		'access-control-allow-headers': 'content-type',
	});

	req.on('end', () => {
		if (body.length > 0) console.log('body:', body);
		res.end(JSON.stringify(resObj));
	});
});

const startHttpServer = () => {
	server.listen(port);
	console.log(`Http server is running on port: ${port}`);
};

export default startHttpServer;
