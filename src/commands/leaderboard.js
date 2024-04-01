//help command in discord es6

import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { getGuildLeaderboard } from '../schemas/userScores.js';

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Laat de leaderboard zien'); 

export async function execute(interaction) {

    const guildLeaderBoard = await getGuildLeaderboard(interaction.guild.id)
    console.log(guildLeaderBoard);
    //set the leaderboard in the description so it can be displayed in the embed
    const leaderboardDescription = guildLeaderBoard.map((user, index) => {
        //add medal emoji to the first 3 users
        if (index === 0) {
            return `🥇 <@${user.userID}> - ${user.score}`;
        }
        if (index === 1) {
            return `🥈 <@${user.userID}> - ${user.score}`;
        }
        if (index === 2) {
            return `🥉 <@${user.userID}> - ${user.score}`;
        }
        return `${index + 1}. <@${user.userID}> - ${user.score}`;

    }).join('\n');

    const embed = new EmbedBuilder()
        .setTitle('Leaderboard van de NPO Kennis Quiz!')
        .setDescription(leaderboardDescription) // Set the string description
        .setColor(0x5865F2)
        .setTimestamp();
    
    interaction.reply({embeds: [embed]});

}



const asyncGetUser = async (userID, interaction) => {

    const fetchedUser = await interaction.client.users.fetch(userID);
    return fetchedUser.username;
}

 

