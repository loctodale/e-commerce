const { Client, GatewayIntentBits } = require("discord.js");
// const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env;
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = "1223183783692472334"; //CHANNELID_DISCORD;

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.login(
      // TOKEN_DISCORD
      "MTIyMzE4MjM2OTU4NzA3MzA0NA.GyCFnp.wpDlnMnb6OoIY2PaGCUDWQTaHXVTKQaOS-yBAM"
    );
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Couldn't find the channel...${this.channelId}`);
      return;
    }
    channel.send(message).catch((e) => console.error(e));
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some addition information about the code",
      title = "Code Exameples",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    this.sendToMessage(codeMessage);
  }
}

module.exports = new LoggerService();
