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

export async function addRole(interaction) {
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
}
    