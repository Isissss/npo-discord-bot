//8ball command in discord
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');


module.exports = {
    
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Vraag de 8ball iets')
        .addStringOption(option => 
            option.setName('vraag')
                .setDescription('Stel een vraag aan de 8ball')
                .setRequired(true)),
    async execute(interaction) {
        const responses = [
            'Ja',
            'Nee',
            'Misschien',
            'Vraag later opnieuw',
            'Ik weet het niet',
            'Zeker',
            'Natuurlijk',
            'Natuurlijk niet',
            'Vraag me dat later nog eens',
            'Vraag me dat nooit meer'
        ];
        const random = Math.floor(Math.random() * responses.length);
        const embed = new EmbedBuilder()
            .setTitle('8ball')
            .setDescription(`Vraag: ${interaction.options.getString('vraag')}\nAntwoord: ${responses[random]}`)
            .setColor(0x00AE86)
            .setFooter({ text: `Commando uitgevoerd door ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        interaction.reply({embeds: [embed]});
    }

};
