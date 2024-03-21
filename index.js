import {
  Client,
  GatewayIntentBits,
  Routes,
  ActivityType,
  Collection,
} from "discord.js";
import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import fs from "fs";
import { checkNews } from "./src/scripts/checkNews.js";
import { checkTime } from "./src/scripts/checkTime.js";
import { addRole } from "./src/scripts/addRole.js";
import { time } from "console";

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
main();


client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton() && interaction.channel.name == "rollen")
    addRole(interaction);

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

function findChannel(name) {
  return client.channels.cache.find((channel) => channel.name === name);
}

const newsChannel = findChannel("nieuws");
const timeChannel = findChannel("vraag-van-de-dag");


function executeTimedScripts() {
    checkNews(newsChannel);
    checkTime(timeChannel);
}


setInterval(executeTimedScripts, 60000);





