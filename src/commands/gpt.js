//create a command that executes the gpt function 

import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { gpt } from '../api/gpt.js';
import fs from 'fs';


export const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Vraag van de dag');

export async function execute(interaction) {
    await interaction.deferReply(); 

    const response = await gpt();

    const embed = new EmbedBuilder()
        .setTitle('Vraag van de dag')
        .setColor(0xFFA500)
        .setThumbnail('https://npokennis.nl/images/logo_npo_kennis.jpg')

        .setDescription(`${response.vraag}`)
        .setTimestamp();

    //send message no reply
    interaction.editReply({embeds: [embed]});

    fs.writeFileSync('answer.json', JSON.stringify(response.antwoord, null, 2), 'utf-8')


}

    