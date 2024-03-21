
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




export async function checkTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.MessageContent,
        ],
      });

    console.log(hours, minutes);
    if (hours === 15 && minutes === 0) {
      //find a channel called vraag-van-de-dag
      const channel = client.channels.cache.find(
        (channel) => channel.name === "vraag-van-de-dag"
      );
  
      if (!channel) {
        console.log("Channel not found");
        return;
      } else {
        const response = await gpt();
        const embed = new EmbedBuilder()
          .setTitle("Vraag van de dag")
          .setColor(0xffa500)
          .setThumbnail("https://npokennis.nl/images/logo_npo_kennis.jpg")
          .setDescription(`${response.vraag}`)
          .setTimestamp();
  
        channel.send({ embeds: [embed] });
      }
    }
  }