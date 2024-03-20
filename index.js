import {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  Routes,
  ActivityType,
  SlashCommandBuilder,
  Collection,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import fs from "fs";

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

//if user uses /vraag command check if channel name #vraag-van-de-dag and #antwoord-van-de-dag exists if not create them

client.on("messageCreate", async (message) => {
    if (message.content === "/vvdd") {
        const guild = client.guilds.cache.get(guildID);
        const vraagChannel = guild.channels.cache.find(
        (channel) => channel.name === "vraag-van-de-dag"
        );
        const antwoordChannel = guild.channels.cache.find(
        (channel) => channel.name === "antwoord-van-de-dag"
        );
    
        if (!vraagChannel) {
        guild.channels.create( {
            name: "vraag-van-de-dag",
            type: ChannelType.GuildText,
            //read only for everyone
            permissionOverwrites: [
            {
                id: guild.roles.everyone,
                allow: [],
                deny: [PermissionsBitField.SendMessages],
            },
            ],
           
        });
        }
    
        if (!antwoordChannel) {
        guild.channels.create( {
            name: "antwoord-van-de-dag",
            type: ChannelType.GuildText,
            //allow everyone to read and write
            permissionOverwrites: [
            {
                id: guild.roles.everyone,
                allow: [PermissionsBitField.SendMessages],
                deny: [],
            },
            ],
          
        });
        }
    }
    }
);




main();
