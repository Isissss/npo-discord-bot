import { SlashCommandBuilder } from '@discordjs/builders';
import { Wordle } from 'discord-gamecord';
import { wordList } from '../db/lingowords.js'; 


const filteredWords = wordList.filter(word => word.length < 6);

export const data = new SlashCommandBuilder()
  .setName("lingo")
  .setDescription("Speel een ronde Lingo!");

export async function execute(interaction) {
  const randomWord = () => filteredWords[Math.floor(Math.random() * filteredWords.length)];

  const Game = new Wordle({
    message: interaction,
    isSlashGame: false,
    embed: {
      title: "Lingo",
      color: "#5865F2"
    },
    customWord: randomWord(), 
    timeoutTime: 60000,
    winMessage: 'Je hebt het woord geraden! Het woord was **{word}**',
    loseMessage: 'Jammer! Het woord was.. **{word}**',
    playerOnlyMessage: 'Alleen {player} kan de knoppen gebruiken.'
  });

  Game.startGame();
  Game.on('gameOver', (result) => {
    return;
  });
};
