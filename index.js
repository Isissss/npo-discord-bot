const { EmbedBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { Collection } = require("discord.js");
const fs = require("fs");
const { config } = require("dotenv");
const { Client, GatewayIntentBits, PermissionsBitField, Routes, ActivityType, SlashCommandBuilder } = require("discord.js");
const { REST } = require("@discordjs/rest");

const prefix = "/";
const commands = [];

config();

const token = process.env.TOKEN;
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

const rest = new REST({
    version: '9'

}).setToken(token);


const client = new Client({
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },

    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping]

});


client.on ('ready', () => {
    console.log('The client is ready!');
   client.user.setPresence({
         activities: [{
                name: 'SchoolTV',
                type: ActivityType.Watching
            }],
            status: 'online'
        });
});
client.login(token)

client.slashCommands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.slashCommands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}


async function main(){
    try{
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(clientID, guildID),
            {body: commands}
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error){
        console.error(error);
    }
}
main();


client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const {commandName} = interaction;
    const command = client.slashCommands.get(commandName);



    if(!command) return;

    try{
        await command.execute(interaction);
    } catch (error){
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});



















