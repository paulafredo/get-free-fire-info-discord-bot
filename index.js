import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fetch from 'node-fetch';
import axios from 'axios';
import 'dotenv/config'
import config from './config/config.js';

// Bot setup
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Replace these with your IDs
const SERVER_ID = config.SERVER_ID; // Your server ID
const APPLICATION_ID = config.APPLICATION_ID; // Your bot's application ID
const TOKEN = config.TOKEN; // Your bot token


// Slash Command Setup
const commands = [
//   {
//     name: 'check_ban',
//     description: 'Check if a UID is banned.',
//     options: [
//       {
//         name: 'region',
//         type: 3, // STRING
//         description: 'Region of the UID',
//         required: true,
//       },
//       {
//         name: 'uid',
//         type: 3, // STRING
//         description: 'UID to check',
//         required: true,
//       },
//     ],
//   },

  {
    name: 'obtenir_des_informations',
    description: 'Obtenez des informations sur un joueur de Free Fire.',
    options: [ 
      {
        name: 'uid',
        type: 3, // STRING
        description: 'UID à vérifier',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Register Slash Commands
(async () => {
  try {
    console.log("Actualisation des commandes d'application (/)...");
    await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, SERVER_ID), {
      body: commands,
    });
    console.log("Commandes d'application (/) enregistrées avec succès.");
  } catch (error) {
    console.error(error);
  }
})();

// Bot Event Handlers
bot.once('ready', () => {
  console.log('Bot is ready!');
});

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'get_info') {
    const uid = options.getString('uid');
    const dataInfo = await getPlayerInfo(uid); 

    // Affichage des informations du joueur dans un format lisible
    if (dataInfo.error) {
      await interaction.reply(`Erreur : ${dataInfo.error}`);
    } else {
      
      console.log(dataInfo)

      await interaction.reply({
        embeds: [
          {
            color: 0x0099ff, // Couleur bleue pour un meilleur rendu
            title: '📜 Informations du joueur',
            description: `
      
            **👤 COMPTE**
            ────────────────
            🔹 **Pseudo:** ${dataInfo.nickname}
            🔹 **UID:** ${dataInfo.accountId}
            🔹 **Niveau:** ${dataInfo.level}
            🔹 **Région:** ${dataInfo.region}
            🔹 **Likes:** ${dataInfo.liked}
            🔹 **Dernière connexion:** <t:${Math.floor(dataInfo.lastLoginAt)}:R>
            🔹 **Signature:** ${dataInfo.socialInfo}
      
            **🛡️ GUILDE**
            ────────────────
            🏆 **Nom de la guilde:** ${dataInfo.clanName}
            🆔 **ID de guilde:** ${dataInfo.clanId}
            🔺 **Niveau de guilde:** ${dataInfo.clanLevel}
            👥 **Membres actifs:** ${dataInfo.memberNum} / ${dataInfo.capacity}
      
            **👑 Chef de Guilde**
            ────────────────
            🎖️ **Pseudo du leader:** ${dataInfo.nicknameChef}
            🆔 **UID du leader:** ${dataInfo.clanCaptainId}
            🏅 **Niveau du leader:** ${dataInfo.levelChef}
            ⏳ **Dernière connexion:** <t:${Math.floor(dataInfo.lastLoginChef)}:R>
      
            🔗 **Suivez l'admin**
            ────────────────
            📱 [Tiktok](https://www.tiktok.com/@thug.4ff)  
            🌐 [Site Web](https://free-fire-info.vercel.app/)
            `,
            fields: [
              {
                name: '🎭 Skin équipé',
                value: 'Voici l\'image du skin équipé :',
              },
            ],
            image: {
              url: dataInfo.avatar_image_url, // URL de l'image du skin
            },
            timestamp: new Date(),
            footer: {
              text: '📌 Données mises à jour en temps réel',
            },
          },
        ],
      });
         
    }
  }


});

async function getPlayerInfo(playerId) {
  try {
    if (!Number.isInteger(Number(playerId))) {
      return { error: 'Player ID doit être un entier valide.' };
    }

    const url = `https://id-game-checker.p.rapidapi.com/ff-player-info/${playerId}/SG`;

    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': config.RAPIDAPI_KEY,
        'x-rapidapi-host': config.RAPIDAPI_HOST,
      },
    });

    const responseData = response.data;

    if (responseData.status === 200) {
      const data = typeof responseData.data === 'string' ? JSON.parse(responseData.data) : responseData.data;

      const basicInfo = data.basicInfo || {};
      const clanBasicInfo = data.clanBasicInfo || {};
      

      return {

        status: responseData.status,
        accountId: basicInfo.accountId || 'N/A',
        nickname: basicInfo.nickname || 'N/A',
        region: basicInfo.region || 'N/A',
        level: basicInfo.level || 'N/A',
        lastLoginAt: basicInfo.lastLoginAt || 'N/A',
        liked: basicInfo.liked || 'N/A',
        socialInfo: data.socialInfo.signature || 'N/A',
        avatar_image_url: data.profileInfo?.clothes?.images?.[0] || null,
        clanId: clanBasicInfo.clanId || 'N/A',
        clanName: clanBasicInfo.clanName || 'N/A',
        clanLevel: clanBasicInfo.clanLevel || 'N/A',
        memberNum: clanBasicInfo.memberNum || 'N/A',
        capacity: clanBasicInfo.capacity || 'N/A',
        nicknameChef: data.captainBasicInfo.nickname || 'N/A',
        levelChef: data.captainBasicInfo.level || 'N/A',
        clanCaptainId: data.captainBasicInfo.accountId || 'N/A',
        captainRank: data.captainBasicInfo.rank || 'N/A',
        likedChef: data.captainBasicInfo.liked  || 'N/A',
        lastLoginChef : data.captainBasicInfo.lastLoginAt  || 'N/A',
          
    };
    } else {
      return { error: `Erreur API: ${responseData.status}` };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// Login to Discord
bot.login(TOKEN);
