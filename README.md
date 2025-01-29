# Bot Discord - Informations sur les joueurs de Free Fire

Ce projet consiste en un bot Discord créé avec Node.js qui permet de récupérer et d'afficher des informations sur les joueurs de Free Fire via une commande Slash (`/obtenir_des_informations`).

## Fonctionnalités

- **Commande `/obtenir_des_informations`** : Permet de récupérer des informations détaillées sur un joueur de Free Fire en utilisant son UID.
- Les informations incluent :
  - **Informations sur le joueur** : Pseudo, UID, niveau, région, dernière connexion, etc.
  - **Informations sur la guilde** : Nom de la guilde, ID de guilde, niveau de guilde, etc.
  - **Chef de guilde** : Pseudo du leader, UID du leader, dernier statut de connexion.
  - **Image de skin équipé** : Affichage de l'image du skin du joueur.

## Prérequis

Avant de démarrer le bot, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- **Node.js** (version 16.0 ou supérieure) : [Télécharger Node.js](https://nodejs.org)
- **NPM** (inclus avec Node.js)

## Installation

1. **Cloner le repository** :

   ```bash
   git clone [https://github.com/ton-utilisateur/ton-repository.git](https://github.com/paulafredo/get-free-fire-info-discord-bot.git)
   cd ton-repository
