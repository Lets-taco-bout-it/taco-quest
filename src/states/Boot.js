import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  background,
  speed = 4;

export default class extends Phaser.State {
  constructor() {
    super();
    //keep track of variables here
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1400, 560);

    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);

    guy = game.add.sprite(20, 525, "guy");
    guy.scale.setTo(2, 2);
    guy.anchor.setTo(0.5, 0.5);
    guy.animations.add("walk", [0, 1, 2, 3, 4]);
    game.camera.follow(guy);
    game.physics.enable(guy);
    guy.body.collideWorldBounds = true;
    guy.body.gravity.y = 800;

    game.add.text(0, 0, `${game.state.current}`);

    // game.camera.deadzone = new Phaser.Rectangle(centerX - 400, 0, 600, 700);
  }

  update() {
    //moving background
    background.tilePosition.x -= 2;

    guy.animations.play("walk", 14, true);

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      guy.scale.setTo(2, 2);
      guy.x += speed;
      // guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      guy.scale.setTo(-2, 2);
      guy.x -= speed;
      // guy.animations.play("walk", 14, true);
    } else if (
      game.input.keyboard.isDown(Phaser.Keyboard.UP) &&
      guy.body.onFloor()
    ) {
      guy.body.velocity.y = -400;
    }

    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      switchState();
    }
  }
}
