import { Text } from "./text";
export enum ScoreOperations {
    INCREASE,
    DECREASE,
    SET_VALUE,
}

export class Score extends Text {
    private scoreValues: number;
    constructor(scene: Phaser.Scene, x: number, y: number, initScore = 0) {
        super(scene, x, y, `Score: ${initScore}`);
        scene.add.existing(this);
        this.scoreValues = initScore;
    }

    public changeValue(operation: ScoreOperations, value: number): void {
        switch (operation) {
            case ScoreOperations.INCREASE:
                this.scoreValues += value;
                break;

            case ScoreOperations.DECREASE:
                this.scoreValues -= value;
                break;

            case ScoreOperations.SET_VALUE:
                this.scoreValues = value;
                break;
            default:
                break;
        }

        this.setText(`Score: ${this.scoreValues}`);
    }

    public getValue(): number {
        return this.scoreValues;
    }
}