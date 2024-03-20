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
  } else {
    //check if channel 'nieuw' exists
    const newsChannel = guild.channels.cache.find(
      (channel) => channel.name === "nieuws"
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
    } else {
      interaction.reply({
        content: "Nieuws kanaal bestaat al",
        ephemeral: true,
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
    } else {
      interaction.reply({
        content: "Rollen kanaal bestaat al",
        ephemeral: true,
      });
    }

    interaction.reply({ content: "NPO categorie bestaat al", ephemeral: true });
  }
}
