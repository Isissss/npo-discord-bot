//create a command that executes the gpt function

import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { gpt } from "../api/gpt.js";
import fs from "fs";

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Vraag van de dag");

export async function execute(interaction) {
  interaction.reply("Vraag van de dag wordt geladen...");

  const response = await gpt();

  const embed = new EmbedBuilder()
    .setTitle("Vraag van de dag")
    .setColor(0xffa500)
    .setThumbnail("https://npokennis.nl/images/logo_npo_kennis.jpg")

    .setDescription(`${response.vraag}`)
    .setTimestamp();

  //send message no reply
  interaction.followUp({ embeds: [embed] });
  //remove the first reply
  interaction.deleteReply();

  fs.writeFileSync(
    "answer.json",
    JSON.stringify(response.antwoord, null, 2),
    "utf-8"
  );
}
