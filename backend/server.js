var fs = require('fs');

var options = {
	key: fs.readFileSync('/etc/letsencrypt/live/louderyoutube.video/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/louderyoutube.video/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/louderyoutube.video/chain.pem'),
	requestCert: false,
	rejectUnauthorized: false
};
var port = process.env.PORT || 3000;
var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
	httpsOptions: {
		...options
	},
	originWhitelist: ["https://louderyoutube.video", "http://localhost:4200"],
	requireHeader: ['origin', 'x-requested-with'],
	removeHeaders: ['cookie', 'cookie2']
}).listen(port, function () {
	console.log('Running CORS Anywhere on ' + "host" + ':' + port);
});


