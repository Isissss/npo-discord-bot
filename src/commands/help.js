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
            { name: '/8ball', value: 'Vraag de 8ball iets' },
            { name: '/ping', value: 'Laat de ping zien' },
            { name: '/server', value: 'Laat de server info zien' },
            { name: '/user-info', value: 'Laat jouw info zien' },
        );

    interaction.reply({embeds: [embed]});

}



