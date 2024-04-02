
// import {
//     Client,
//     GatewayIntentBits,
//     PermissionsBitField,
//     Routes,
//     ActivityType,
//     SlashCommandBuilder,
//     Collection,
//     ChannelType,
//     ButtonBuilder,
//     EmbedBuilder,
//     ActionRowBuilder,
//     ButtonStyle,
//   } from "discord.js";




// export async function checkTime(channel) {
//     const date = new Date();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();

//     console.log(hours, minutes);
//     if (hours === 15 && minutes === 0) {
      
  
//       if (!channel) {
//         console.log("Channel not found");
//         return;
//       } else {
//         const response = await gpt();
//         const embed = new EmbedBuilder()
//           .setTitle("Vraag van de dag")
//           .setColor(0xffa500)
//           .setThumbnail("https://npokennis.nl/images/logo_npo_kennis.jpg")
//           .setDescription(`${response.vraag}`)
//           .setTimestamp();
  
//         channel.send({ embeds: [embed] });
//       }
//     }
//   }