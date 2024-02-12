import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";
import { UIScene } from './scenes/ui';

type GameConfigExtended = Types.Core.GameConfig & {
    winScore: number;
};

export const gameConfig: GameConfigExtended = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    // backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        UIScene,
        GameOver
    ],
    winScore: 40,
};

export default new Game(gameConfig);
