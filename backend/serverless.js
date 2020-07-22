var ytdl = require("ytdl-core")
const AWS = require('aws-sdk');
AWS.config.update({
    "accessKeyId": "**",
    "secretAccessKey": "**",
    "region": "eu-central-1"
});
module.exports.findVideo = async (event) => {
    var request = JSON.parse(event.body)
    return new Promise((resolve, reject) => {
        var info = ytdl.getInfo(request.link);
        info.then((info) => {
            let format = ytdl.chooseFormat(info.formats, { quality: "highest" });
            resolve({ "url": format.url, "length": info.length_seconds, "channel_url": info.author.channel_url, "video_id": info.video_id + '.mp4', view: info.playerResponse.videoDetails.viewCount, title: info.title, author: info.author.name, nextVideo: info.related_videos[0] })
        })
    });
};
