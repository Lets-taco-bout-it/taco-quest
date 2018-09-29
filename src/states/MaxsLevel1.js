import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  background,
  taco,
  speed = 4,
  manHole,
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
    game.load.image("trash", "src/assets/dumpster3.png");
    game.load.image("manHole", "src/assets/manhole.png", 32, 32);
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

    // manHole = game.add.physicsGroup();
    // manHole.enableBody = true;
    // trashCans.checkWorldBounds = true;
    // manHole.outOfBoundsKill = true;
    // manHole.anchor.setTo(0.8, 0.8);
    // this.makeManHole();

    game.add.text(0, 0, `${game.state.current}`);
  }

  update() {
    game.physics.arcade.collide(guy, trashCans);
    //moving background
    background.tilePosition.x -= 2;
    game.physics.arcade.collide(trashCans);
    // game.physics.arcade.collide(manHole);

    guy.animations.play("walk", 14, true);

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && guy.body.onFloor()) {
      guy.body.velocity.y = -400;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      guy.scale.setTo(2, 2);
      console.log(trashCans, guy);
      guy.body.velocity.x += speed;
      // guy.body.drag = 200;
      if (guy.body.velocity.x > 150) {
        guy.body.velocity.x = 150;
      }
      // guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      guy.scale.setTo(-2, 2);
      guy.body.velocity.x -= speed;
      if (guy.body.velocity.x < -150) {
        guy.body.velocity.x = -150;
      }
      // guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      switchState();
    } else guy.body.velocity.x = 0;

    //Enables jumping off of trash cans
    if (
      game.input.keyboard.isDown(Phaser.Keyboard.UP) &&
      guy.body.touching.down == true
    ) {
      guy.body.velocity.y = -400;
    }
  }

  makeTrash() {
    let trash;
    let min = 200;
    for (var i = 0; i < 6; i++) {
      const randomNumber = () => {
        // 200 is the range (plus min)
        const num = Math.random() * 200 + min;
        // min adjusts distance between trash
        min += 450;
        return num;
      };
      console.log(randomNumber(), roll);
      let roll = randomNumber();

      trash = trashCans.create(roll, 470, "trash");

      trash.scale.setTo(0.7, 0.7);
      trash.body.velocity.x = -175;
      trash.body.immovable = true;
    }
  }

  makeManHole() {
    // trash locations ish
    //0-200, 650-850, 1100-1300, 1550-1750
    // let hole;
    // let min = 200;
    // for (var i = 0; i < 8; i++) {
    //   const randomNumber = () => {
    //     // 200 is the range (plus min)
    //     const num = Math.random() * 200 + min;
    //     // min adjusts distance between trash
    //     min += 450;
    //     return num;
    //   };
    //   let roll = randomNumber();
    //   hole = trashCans.create(roll, 470, "manHole");
    //   manHole.scale.setTo(0.7, 0.7);
    //   manHole.body.velocity.x = -175;
    //   manHole.body.immovable = true;
    // }
  }

  collisionHandler(obj1, obj2) {
    console.log("touched");
  }
}
