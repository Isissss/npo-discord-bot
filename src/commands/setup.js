import {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} from "discord.js";
import { roles } from "../roles.js";
import { createOrUpdateGuildSettings, getGuildSettings } from "../schemas/guildSettings.js";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Maak de NPO categorie aan");

export async function execute(interaction, client) {
  const guild = interaction.guild;
  const guildSettings = await getGuildSettings(guild.id) || { guildId: guild.id }; 
  let shouldCreateRoleMessages = false;
 
  //check if category NPO exists
  let category = guild.channels.cache.find(
    (channel) => channel.name === "NPO"
  );

  if (!category) {
    category = await guild.channels.create({
      name: "NPO",
      type: ChannelType.GuildCategory,
    }); 
  }

  let channelsToCreate = [];
  const guildChannels = guild.channels.cache;
  if (!guildSettings.announcementsChannelID || (guildSettings.announcementsChannelID &&  !guildChannels.find((channel) => channel.id === guildSettings.announcementsChannelID))) {
    channelsToCreate.push("aankondigingen");
  }
  if (!guildSettings.newsChannelID || (guildSettings.newsChannelID && !guildChannels.find((channel) => channel.id === guildSettings.newsChannelID))) {
    channelsToCreate.push("nieuws");
  }
  if (!guildSettings.rolesChannelID || (guildSettings.rolesChannelID && !guildChannels.find((channel) => channel.id === guildSettings.rolesChannelID))) {
    channelsToCreate.push("rollen");
  }
 
  for (const channel of channelsToCreate) {
    const createdChannel = await guild.channels.create({
      name: channel,
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

    switch(channel) {
      case "aankondigingen":
        guildSettings.announcementsChannelID = createdChannel.id;
        if (!guildSettings.webhookURL) {
          const webhook = await createdChannel.createWebhook({ name: 'NPO Notificaties', avatar: client.defaultAvatarURL });
          if (webhook) {
            guildSettings.webhookURL = webhook.url;
          }
        } 
        break;
      case "nieuws":
        guildSettings.newsChannelID = createdChannel.id;
        break;
      case "rollen":
        guildSettings.rolesChannelID = createdChannel.id;
        shouldCreateRoleMessages = true;
        break;
    }

  } 
  
  createOrUpdateGuildSettings(guildSettings); 

   // if roles channel was created, create role messages
  if (shouldCreateRoleMessages) { 
    await roles({ guild });
  }

  interaction.reply('NPO setup is voltooid');
}
 
