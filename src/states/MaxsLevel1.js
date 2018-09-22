import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  background,
  taco,
  speed = 4,
  trash,
  trashCans;

export default class extends Phaser.State {
  constructor() {
    super();
    //keep track of variables here
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    // game.load.image("taco", "src/assets/taco.png", 32, 32);
    game.load.image("trash", "src/assets/trashCan.jpeg");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2800, 560);

    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);

    guy = game.add.sprite(20, 525, "guy");
    guy.scale.setTo(2, 2);
    guy.anchor.setTo(0.5, 0.5);
    guy.animations.add("walk", [0, 1, 2, 3, 4]);
    game.camera.follow(guy);
    game.physics.enable(guy, Phaser.Physics.ARCADE);
    guy.body.collideWorldBounds = true;
    guy.body.gravity.y = 800;

    trashCans = game.add.physicsGroup();
    trashCans.enableBody = true;
    trashCans.checkWorldBounds = true;
    trashCans.outOfBoundsKill = true;
    this.makeTrash();

    trashCans.body.immovable = true;
    // trashCans.body.velocity.x = -2;

    game.add.text(0, 0, `${game.state.current}`);
  }

  update() {
    game.physics.arcade.collide(guy, trashCans);
    //moving background
    background.tilePosition.x -= 2;

    guy.animations.play("walk", 14, true);

    if (
      game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
      guy.body.onFloor()
    ) {
      guy.body.velocity.y = -400;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      guy.scale.setTo(2, 2);
      console.log(trashCans, guy);
      guy.body.velocity.x += speed;
      // guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      guy.scale.setTo(-2, 2);
      guy.x -= speed * 3;
      // guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      switchState();
    }
  }

  makeTrash() {
    for (var i = 0; i < 10; i++) {
      trash = trashCans.create(Math.random() * 2800, 500, "trash");
      trash.scale.setTo(0.3, 0.3);
      trash.body.velocity.x = -2;
      trashCans.body.immovable = true;

      // trash.enableBody = true;
      game.physics.arcade.collide(guy, trash);
    }
  }

  collisionHandler(obj1, obj2) {
    console.log("touched");
  }
}
