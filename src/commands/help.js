//help command in discord es6

import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Laat alle commands zien'); 

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('Help')
        .setDescription('Hier zijn alle commands die je kan gebruiken')
        .setColor(0x00AE86)
        .setFooter({ text: `Commando uitgevoerd door ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .addFields(
            { name: '/test', value: 'Vraag van de dag' },
            { name: '/leaderboard', value: 'Laat de leaderboard zien' },
            { name: '/lingo', value: 'Speel een ronde Lingo' },
            { name: '/vraag-van-de-dag', value: 'Stel een vraag van de dag' },
            { name: '/setup', value: 'Setup voor de NPO server bot'},
        );

    interaction.reply({embeds: [embed]});

}



