import { Scene } from "phaser";
import { Score, ScoreOperations } from "../../classes/score";
import { EVENTS_NAME, GameStatus } from "../../consts";
import { Text } from "../../classes/text";
import { gameConfig } from "../../main";

export class UIScene extends Scene {
    private score!: Score;

    private gameEndPhrase!: Text;
    private gameEndHandler: (status: GameStatus) => void;

    private chestLootHandler: () => void;

    constructor() {
        super('ui-scene');
        this.chestLootHandler = () => {
            this.score.changeValue(ScoreOperations.INCREASE, 10);
            if (this.score.getValue() === gameConfig.winScore) {
                this.game.events.emit(EVENTS_NAME.gameEnd, 'win');
            }
        };

        this.gameEndHandler = (status) => {
            this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)');
            this.game.scene.pause('Game');
            this.gameEndPhrase = new Text(
                this,
                this.game.scale.width / 2,
                this.game.scale.height * 0.4,
                status === GameStatus.LOSE
                    ? `WASTED!\nCLICK TO RESTART`
                    : `YOU ARE ROCK!\nCLICK TO RESTART`,
            )
                .setAlign('center')
                .setColor(status === GameStatus.LOSE ? '#ff0000' : '#ffffff');
            this.gameEndPhrase.setPosition(
                this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
                this.game.scale.height * 0.4,
            );
            this.input.on('pointerdown', () => {
                this.game.events.off(EVENTS_NAME.chestLoot, this.chestLootHandler);
                this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler);
                this.scene.get('Game').scene.restart();
                this.scene.restart();
            });
        };
    }
    create(): void {
        this.score = new Score(this, 20, 20, 0);
        console.log(this.score);
        this.initListeners();
    }

    private initListeners(): void {
        this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
        this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
    }
}