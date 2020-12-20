var fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express')
const app = express()
const https = require('https');
var cors_proxy = require('cors-anywhere');

var options = {
	key: fs.readFileSync('/etc/letsencrypt/live/louderyoutube.video/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/louderyoutube.video/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/louderyoutube.video/chain.pem'),
	requestCert: false,
	rejectUnauthorized: false
};
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
const ytsr = require('ytsr');
async function getRandom() {
	const options = {
		page: parseInt((Math.random() * 50)),
		limit: parseInt((Math.random() * 50))
	}
	const filters1 = await ytsr.getFilters('populer music');
	const filter1 = filters1.get('Type').get('Video');
	const searchResults = await ytsr(filter1.url, options);
	return searchResults['items'][parseInt((Math.random() * searchResults.items.length))].url
}

async function getVideo(link) {
	return new Promise(
		async function (resolve, reject) {
			var info = await ytdl.getInfo(link).catch(err => {
				reject()
			});
			let format = await ytdl.chooseFormat(info.formats, { quality: "highest" })

			resolve({
				"url": format.url,
				"length": info.videoDetails.lengthSeconds,
				"channel_url": info.videoDetails.author.channel_url,
				"video_url": info.videoDetails.video_url,
				"view": info.videoDetails.viewCount,
				"title": info.videoDetails.title,
				"author": info.videoDetails.author.name,
				"nextVideo": info.related_videos[0]
			})
		})
}
app.get('/FindVideo/:link', async (req, res) => {
	getVideo(req.params.link).then(video => res.send(video)).catch(err => res.status(404).send())
})
app.get('/Random', async (req, res) => {
	getVideo(await getRandom()).then(video => res.send(video)).catch(err => res.status(404).send())
})
https.createServer(options, app).listen(3001);
cors_proxy.createServer({
	httpsOptions: {
		...options
	},
	//originWhitelist: ["https://louderyoutube.video", "http://localhost:4200"],
	requireHeader: ['origin', 'x-requested-with'],
	removeHeaders: ['cookie', 'cookie2']
}).listen(3002, function () {
	console.log('Running CORS Anywhere on ' + "host" + ':');
});
