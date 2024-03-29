//help command in discord es6

import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { getGuildLeaderboard } from '../schemas/userScores.js';

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Laat de leaderboard zien'); 

export async function execute(interaction) {
    // database call, so defering it to be safe
    await interaction.deferReply(); 

    const guildLeaderBoard = await getGuildLeaderboard(interaction.guild.id)
    console.log(guildLeaderBoard);

 
    // TODO add leaderboard to embed or msg 

    const embed = new EmbedBuilder()
    interaction.editReply({embeds: [embed]});
}

 

