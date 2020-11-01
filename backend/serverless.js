var ytdl = require("ytdl-core")
module.exports.findVideo = async (event) => {
    var request = JSON.parse(event.body)
    return new Promise((resolve, reject) => {
        var info = ytdl.getInfo(request.link);
        info.then((info) => {
            let format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });
            resolve({ "url": format.url, "length": info.length_seconds, "channel_url": info.author.channel_url, "video_id": info.video_id + '.mp4', view: info.playerResponse.videoDetails.viewCount, title: info.title, author: info.author.name, nextVideo: info.related_videos[0] })
        })
    });
};
