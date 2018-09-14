import Phaser from "phaser";

var guy,
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
    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);

    guy = game.add.sprite(20, 525, "guy");
    guy.scale.setTo(2, 2);
    guy.anchor.setTo(0.5, 0.5);
    guy.animations.add("walk", [0, 1, 2, 3, 4]);
  }

  update() {
    //moving background
    // background.tilePosition.x -= 2;

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      guy.scale.setTo(2, 2);
      guy.x += speed;
      guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      guy.scale.setTo(-2, 2);
      guy.x -= speed;
      guy.animations.play("walk", 14, true);
    } else {
      guy.animations.stop("walk");
      guy.frame = 0;
    }
  }
}
