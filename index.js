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
import { getGuildLeaderboard, getGuildUserScore, increaseUserScore } from "./src/schemas/userScores.js";

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
let nieuwsChannel;
let vraagChannel;


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

  nieuwsChannel = client.channels.cache.find(
    (channel) => channel.name === "nieuws"
  );
  vraagChannel = client.channels.cache.find(
    (channel) => channel.name === "vraag-van-de-dag"
  );
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

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton() && interaction.channel.name == "rollen")
    addRole(interaction);

  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = client.slashCommands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});


client.on("messageCreate", (message) => {
  if (message.author.bot) return;

    if (message.channel.name === "antwoord-van-de-dag") {
        const answer = JSON.parse(fs.readFileSync('answer.json', 'utf-8'));
        if (message.content.toLowerCase().includes(answer.toLowerCase())) {
            message.author.send({ content: 'Gefeliciteerd, dat is het juiste antwoord! Je hebt een punt verdiend.', ephemeral: true });
            increaseUserScore(message.guild.id, message.author.id);
        }
        else {
            message.author.send({ content: 'Helaas, dat is niet het juiste antwoord. Probeer het nog een keer.', ephemeral: true });
        }

    }
});

function executeTimedScripts() { 
  if (nieuwsChannel && vraagChannel) {
    checkTime(vraagChannel);
    checkNews(nieuwsChannel);
  }
}

setInterval(executeTimedScripts, 60000);

main();
