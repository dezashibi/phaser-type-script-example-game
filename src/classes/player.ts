import { EVENTS_NAME, GameStatus } from "../consts";
import { Actor } from "./actor";
import { Text } from "./text";

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;

    private hpValue: Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');

        // Keys
        this.keyW = this.initKey('W');
        this.keyA = this.initKey('A');
        this.keyS = this.initKey('S');
        this.keyD = this.initKey('D');
        this.keySpace = this.scene.input.keyboard?.addKey(32)!;
        this.keySpace.on('down', (_event: KeyboardEvent) => {
            this.anims.play('attack', true);
            this.scene.game.events.emit(EVENTS_NAME.attack);
        });

        // Physics
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);

        // Animations
        this.initAnimation();

        // hp
        this.hpValue = new Text(
            this.scene,
            this.x,
            this.y - this.height,
            this.hp.toString()
        ).setFontSize(12).setOrigin(0.8, 0.5);

        this.on('destroy', () => {
            this.keySpace.removeAllListeners();
        });
    }

    update(): void {
        this.getBody().setVelocity(0);
        if (this.keyW.isDown) {
            this.body!.velocity.y = -110;
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyA.isDown) {
            this.body!.velocity.x = -110;
            this.checkFlip();
            this.getBody().setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyS.isDown) {
            this.body!.velocity.y = 110;
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyD.isDown) {
            this.body!.velocity.x = 110;
            this.checkFlip();
            this.getBody().setOffset(15, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);
    }

    private initKey(key: string): Phaser.Input.Keyboard.Key {
        const keyboardKey = this.scene.input.keyboard!.addKey(key);
        if (!keyboardKey) {
            throw new Error(`Failed to initialize key: ${key}`);
        }
        return keyboardKey;
    }

    private initAnimation(): void {
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'run-',
                end: 7,
            }),
            frameRate: 8,
        });

        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'attack-',
                end: 2,
            }),
            frameRate: 8,
        });
    }

    public getDamage(value?: number): void {
        super.getDamage(value);
        this.hpValue.setText(this.hp.toString());
        if (this.hp <= 0) {
            this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
        }
    }
}