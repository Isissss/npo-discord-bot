const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zie alle commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Hier zijn alle commands die je kan gebruiken. Voor meer informatie over een command, gebruik /help <command>')
            .setColor(0x00AE86)
            .addFields(
                {name: 'Nieuws', value: 'Test', inline: true})
            .setFooter({ text: `Commando uitgevoerd door ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        interaction.reply({embeds: [embed]});
    },
};