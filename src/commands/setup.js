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
  if (!guildSettings.announcementsChannelID || (guildSettings.announcementsChannelID && !guildChannels.find((channel) => channel.id === guildSettings.announcementsChannelID))) {
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

    switch (channel) {
      case "aankondigingen":
        guildSettings.announcementsChannelID = createdChannel.id;
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

  // check if webhook exists
  if (!guildSettings.webhookURL || !await webhookIsValid(guildSettings.webhookURL)) {
    const webhook = await createWebhook(guildSettings.announcementsChannelID, client);
    guildSettings.webhookURL = webhook.url;
  }

  await createOrUpdateGuildSettings(guildSettings);

  // if roles channel was created, create role messages
  if (shouldCreateRoleMessages) {
    await roles({ guild });
  }

  interaction.reply('NPO setup is voltooid');
}

const webhookIsValid = async (webhookURL) => {
  return fetch(webhookURL, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then(({ url }) => {
      if (url) return true

      return false;
    }).catch(() => {
      return false;
    });
}

const createWebhook = async (channelID, client) => {
  const channel = client.channels.cache.get(channelID);
  const webhook = await channel.createWebhook({ name: 'NPO Notificaties', avatar: "https://utfs.io/f/d0f4942e-e3e1-4eae-af66-e1548fba337e-zezxew.png" });
  return webhook;
}

