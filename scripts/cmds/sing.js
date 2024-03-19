module.exports = {
  config: {
    name: "sing",
     aliases: ["song"],
    version: "1.0",
    author: "JARiF",
    countDown: 5,
    role: 0,
    category: "𝗠𝗘𝗗𝗜𝗔"
  },

  onStart: async function ({ api, event }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const yts = require("yt-search");

    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please provide a song name. 🎵", event.threadID);
    }

    data.shift();
    const song = data.join(" ");

    try {
      api.sendMessage(`🔍 Finding information for "${song}". Please wait... ⏳`, event.threadID);

      const searchResults = await yts(song);
      if (!searchResults.videos.length) {
        return api.sendMessage("Error: Invalid request. ❌", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `music.mp3`;
      const filePath = __dirname + `/tmp/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', '📥 Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name} 🎶`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded ✅');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('❗ [ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        // Create a premium-style message with emojis
        const message = {
          body: `<< 𝗦𝗜𝗡𝗚 >> | 𝗠𝗔𝗟𝗧𝗔 𝗔𝗜 𝗕𝗢𝗧\n━━━━━━━━━━━━━━━━━━━\nEnjoy your music with MALTA STUDIO ♡🥀\n\n🎵 Title: ${video.title}\n🎤 Artist: ${video.author.name}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('🚫 An error occurred while processing the command. Please try again later.', event.threadID);
    }
  }
};