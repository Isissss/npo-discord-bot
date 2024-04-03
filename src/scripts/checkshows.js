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
  
  import fs from 'fs';

// Sample TV listings data
const tvListings = [
  {
    id: "1",
    title: "NOS Journaal",
    airTime: "2024-04-01T23:50:00.000Z",
    src: "https://cdn.discordapp.com/attachments/1150758627792142487/1224478422483603476/91490d28-4047-42a8-af71-8229beda215c.png?ex=661da365&is=660b2e65&hm=5937af82448ebbcee6fd69d839062fa6c2d8fbbad8dc9cb863b5cfee3becc477&"
  }
];

let sentMessageIds = new Set(); // Store unique IDs in a Set

export async function checkTVShows(channel) {
  const currentTimestamp = Date.now();
  const bufferTime = 15 * 60 * 1000;

  if (!tvListings) {
    console.error("TV listings data not available.");
    return; // Handle the case where loading failed
  }

  const upcomingShows = tvListings.filter((show) => {
    const airTime = new Date(show.airTime).getTime();
    return airTime - bufferTime > currentTimestamp;
  });
  
  for (const show of upcomingShows) {
    const showId = show.id; // Access the ID from the show object

    if (sentMessageIds.has(showId)) {
      console.log(`Show with ID ${showId} already sent notification, skipping.`);
      continue; // Skip to the next show if ID exists
    }

    // Add show ID to the set
    sentMessageIds.add(showId);

    const airTime = new Date(show.airTime);
    const adjustedAirTime = new Date(airTime.getTime() - (2 * 60 * 60 * 1000)); // Subtract 2 hours in milliseconds
    const showEmbed = new EmbedBuilder()
      .setTitle(show.title)
      .setColor(0xffa500)
      .setDescription(`Wordt uitgezonden om ${adjustedAirTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })} uur`)
      .setImage(show.src)
      .setTimestamp();

    channel.send({ embeds: [showEmbed] });
  }
}
