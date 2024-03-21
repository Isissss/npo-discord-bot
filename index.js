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
import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import fs from "fs";
import { gpt } from "./src/api/gpt.js";
import { nationalNews, sportNews } from "./src/api/scrapeNews.js";
//import crypto
import crypto from "crypto";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const commands = [];
const clientId = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

client.once("ready", () => {
  client.user.setPresence({
    activities: [
      {
        name: "SchoolTV",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });

  console.log("Ready!");
});

client.login(process.env.TOKEN);

client.slashCommands = new Collection();
//fs loop through commands folder es6 so without require
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = await import(`./src/commands/${file}`);
  client.slashCommands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

async function main() {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = client.slashCommands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});


async function checkTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
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
setInterval(checkTime, 60000);

const checkNews = async () => {
  const nationalNewsData = await nationalNews();
  const sportNewsData = await sportNews();

  console.log("News scraped");
  const channel = client.channels.cache.find(
    (channel) => channel.name === "nieuws"
  );

  if (!channel) {
    console.log("Channel not found");
    return;
  } else {
//hash both national and sport news text
    const nationalHash = crypto.createHash('sha256').update(nationalNewsData.text).digest('hex');
    const sportHash = crypto.createHash('sha256').update(sportNewsData.text).digest('hex');
    //check the json file if the hash already exists
    const jsonFile = fs.readFileSync('./hashes.json');
    const hashes = JSON.parse(jsonFile);
    const nationalNewsMessage = hashes.find(hash => hash === nationalHash);
    const sportNewsMessage = hashes.find(hash => hash === sportHash);





    const nationalNewsRole = channel.guild.roles.cache.find(
      (role) => role.name === `${nationalNewsData.tag}`
    );
    const sportNewsRole = channel.guild.roles.cache.find(
      (role) => role.name === `${sportNewsData.tag}`
    );

    if (!nationalNewsMessage) {
        hashes.push(nationalHash);
        fs.writeFileSync('./hashes.json', JSON.stringify(hashes));

      const nationalNewsEmbed = new EmbedBuilder()
        .setTitle("Binnenland")
        .setColor(0xffa500)
        .setDescription(nationalNewsData.text)
        .setImage(nationalNewsData.src)
        .setURL(nationalNewsData.href)
        .setTimestamp();

      const newsButton = new ButtonBuilder()
        .setLabel("Open artikel")
        .setStyle(ButtonStyle.Link)
        .setURL(nationalNewsData.href);

      const newsActionRow = new ActionRowBuilder().addComponents(newsButton);


      channel.send({
        content: `${nationalNewsRole.toString()}`,
        embeds: [nationalNewsEmbed],
        components: [newsActionRow],
      });

    }
    if (!sportNewsMessage) {
        hashes.push(sportHash);
        fs.writeFileSync('./hashes.json', JSON.stringify(hashes));
        
      const sportNewsEmbed = new EmbedBuilder()
        .setTitle("Sport")
        .setColor(0xffa500)
        .setDescription(sportNewsData.text)
        .setImage(sportNewsData.src)
        .setURL(sportNewsData.href)
        .setTimestamp();

      const sportButton = new ButtonBuilder()
        .setLabel("Open artikel")
        .setStyle(ButtonStyle.Link)
        .setURL(sportNewsData.href);

      const sportActionRow = new ActionRowBuilder().addComponents(sportButton);

      channel.send({
        content: `${sportNewsRole.toString()}`,
        embeds: [sportNewsEmbed],
        components: [sportActionRow],
      });

    }
  }
};


setInterval(checkNews, 60000);

//if someone presses a button in the rollen kanaal give him the role

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
        
    const role = interaction.guild.roles.cache.find(
        (role) => role.name === interaction.component.label
    );
    if (!role) {
        return interaction.reply({
            content: "Rol niet gevonden",
            ephemeral: true,
        });
    }

    //if user already has the role remove it
    if (interaction.member.roles.cache.has(role.id)) {
        interaction.member.roles.remove(role);
        interaction.reply({
            content: `Rol ${role.name} verwijderd`,
            ephemeral: true,
        });

    } else {
        interaction.member.roles.add(role);
        interaction.reply({
            content: `Rol ${role.name} toegevoegd`,
            ephemeral: true,
        });
    }
    
    
    });




main();
