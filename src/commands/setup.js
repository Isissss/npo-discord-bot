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
import { roles } from "../roles.js";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Maak de NPO categorie aan");

export async function execute(interaction) {
  const guild = interaction.guild;

  //check if category NPO exists
  const category = guild.channels.cache.find(
    (channel) => channel.name === "NPO"
  );

  if (!category) {
    guild.channels.create({
      name: "NPO",
      type: ChannelType.GuildCategory,
    });
    interaction.reply({
      content: "NPO categorie is aangemaakt",
      ephemeral: true,
    });
  } 
    //check if channel 'nieuws' exists
    const newsChannel = guild.channels.cache.find(
      (channel) => channel.name === "nieuws"
    );

    const showsChannel = guild.channels.cache.find(
      (channel) => channel.name === "shows"
    );

    const rolesChannel = guild.channels.cache.find(
      (channel) => channel.name === "rollen"
    );

    if (!newsChannel) {
      guild.channels.create({
        name: "nieuws",
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
            deny: [PermissionsBitField.Flags.SendMessages],
          },
        ],
      });
    } 

    if (!showsChannel) {
      guild.channels.create({
        name: "shows",
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
            deny: [PermissionsBitField.Flags.SendMessages],
          },
        ],
      });
    } 
    
    if (!rolesChannel) {
      guild.channels.create({
        name: "rollen",
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
            deny: [PermissionsBitField.Flags.SendMessages],
          },
        ],
      });
    } 
      const role = guild.roles.cache.find((role) => role.name === 'Oorlog');
      if (!role) {
        await roles({ guild });
      }

      
    
    
      
    interaction.reply('NPO setup is voltooid');





  
}
