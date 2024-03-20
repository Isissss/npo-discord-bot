import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('kennis')
    .setDescription('Vraag iets waar jij het antwoord niet op weet');

export async function execute(interaction) {

    const embed = new EmbedBuilder()
        .setTitle('8ball')
        .setDescription(`Vraag: ${interaction.options.getString('question')}\nAntwoord: ${response}`)
        .setColor(0x00AE86)
        .setFooter({ text: `Commando uitgevoerd door ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

    interaction.reply({embeds: [embed]});

}


