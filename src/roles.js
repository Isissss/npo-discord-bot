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

  

  export async function roles({guild}) {
    //create 4 roles
    const roleNames = ["Binnenland", "Buitenland", "Sport", "Vraag van de dag"];
    const roleColors = ["#00ff00", "#0000ff", "#ffff00", "#ff00ff"];
    const roles = [];
    for (let i = 0; i < roleNames.length; i++) {
      const role = await guild.roles.create({
        name: roleNames[i],
        color: roleColors[i],
      });
      roles.push(role);
    }

    //create an embed for reaction roles
    const embed = new EmbedBuilder()
      .setTitle("NPO Notificaties")
      .setDescription(
        "Kies een rol om notificaties te ontvangen over de volgende onderwerpen: Oorlog, Binnenland, Buitenland, Sport, Vraag van de dag"
      )
      .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Npologo.svg/1200px-Npologo.svg.png")
      .setColor(0xffa500)

    //create buttons for reaction roles
    const buttons = [];
    for (let i = 0; i < roleNames.length; i++) {
      const button = new ButtonBuilder()
        .setCustomId(i.toString())
        .setLabel(roleNames[i])
        .setStyle(ButtonStyle.Primary)
      buttons.push(button);
    }

    //create action row for buttons
    const actionRow = new ActionRowBuilder();
    for (const button of buttons) {
      actionRow.addComponents(button);
    }

    //find the channel to send the message
    const channel = guild.channels.cache.find(
      (channel) => channel.name === "rollen"
    );

    //send the message
    channel.send({
      content: "Kies een rol",
      embeds: [embed],
      components: [actionRow],
    });

   


    // return { roles, embed, actionRow };



  }

    
