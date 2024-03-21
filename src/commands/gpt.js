//create a command that executes the gpt function 

import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { gpt } from '../api/gpt.js';


export const data = new SlashCommandBuilder()
    .setName('vraag')
    .setDescription('Vraag van de dag');

export async function execute(interaction) {
    const response = await gpt();

    const embed = new EmbedBuilder()
        .setTitle('Vraag van de dag')
        .setColor(0xFFA500)
        .setThumbnail('https://npokennis.nl/images/logo_npo_kennis.jpg')

        .setDescription(`${response.vraag}`)
        .setTimestamp();

    //send message no reply
    interaction.reply({embeds: [embed]});

}

    