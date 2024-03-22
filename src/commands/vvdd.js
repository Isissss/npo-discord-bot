
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

export const data = new SlashCommandBuilder()
    .setName('vvdd')
    .setDescription('Activeer de Vraag van de dag');

export async function execute(interaction) {
    const guild = interaction.guild;

    const category = guild.channels.cache.find(
        (channel) => channel.name === "NPO"
      );


    if (category) {

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
            parent: category,
            //read only for everyone
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    allow: [],
                    deny: [PermissionsBitField.Flags.SendMessage],
                },
            ],
        });
    }
    else {
        interaction.reply({ content: "Vraag van de dag bestaat al", ephemeral: true });
    }

    if (!antwoordChannel) {
        guild.channels.create( {
            name: "antwoord-van-de-dag",
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    allow: [
                        PermissionsBitField.Flags.SendMessages,
                    ],
                    deny: [],
                },
            ],
        });
    }
    else {
        interaction.reply({ content: "Antwoord van de dag bestaat al", ephemeral: true });
    }
    interaction.reply('Vraag van de dag is geactiveerd');

}
else {
    interaction.reply({ content: "NPO categorie bestaat nog niet. Gebruik /setup om deze aan te maken", ephemeral: true });

}
}

