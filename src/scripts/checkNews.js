import {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    Routes,
    ActivityType,
    SlashCommandBuilder,
    Collection,
    ChannelType,
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
  } from "discord.js";
  import fs from "fs";
  import {fetchNewsFromNos} from "../api/scrapeNews.js";



 export async function checkNews() {
    const hashes = JSON.parse(fs.readFileSync('./hashes.json')); 
    const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.MessageContent,
        ],
      });

    const [national, sport, international] = await Promise.all([
        fetchNewsFromNos('https://nos.nl/nieuws/binnenland', 'Binnenland'),
        fetchNewsFromNos('https://nos.nl/sport/laatste', 'Sport'),
        fetchNewsFromNos('https://nos.nl/nieuws/buitenland', 'Buitenland')
    ]);
    const channel = client.channels.cache.find(c => c.name === "nieuws");
    if (!channel) return console.log("Channel not found"); 

    const sendNews = (data, tag) => {
        const hash = crypto.createHash('sha256').update(data.text).digest('hex');
        const exists = hashes.find(h => h === hash);
        if (exists) return console.log("Hash found");
        hashes.push(hash);
        const role = channel.guild.roles.cache.find(r => r.name === tag);

        const newsEmbed = new EmbedBuilder()
            .setTitle(tag) 
            .setColor(0xffa500)
            .setDescription(data.text)
            .setImage(data.src)
            .setURL(data.href)
            .setTimestamp();

        const newsButton = new ButtonBuilder()
            .setLabel("Open artikel")
            .setStyle(ButtonStyle.Link)
            .setURL(data.href);

        const newsActionRow = new ActionRowBuilder().addComponents(newsButton);

        channel.send({
            content: `${role.toString()}`,
            embeds: [newsEmbed],
            components: [newsActionRow]
        });
        fs.writeFileSync('./hashes.json', JSON.stringify(hashes));
    };

    sendNews(national, national.tag);
    sendNews(sport, sport.tag);
    sendNews(international, international.tag);

};



