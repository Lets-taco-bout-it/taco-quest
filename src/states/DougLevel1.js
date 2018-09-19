import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  tacocat,
  background,
  tacos,
  taco,
  speed = 4;

export default class extends Phaser.State {
  constructor() {
    super();
    //keep track of variables here
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    game.load.image("taco", "src/assets/taco.png");
    game.load.spritesheet(
      "tacocat",
      "src/assets/tacocatspritesheet.png",
      32,
      32,
      17
    );
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
    game.physics.enable(guy);
    guy.body.collideWorldBounds = true;
    guy.body.gravity.y = 800;

    tacos = game.add.group();

    //  We will enable physics for any taco that is created in this group
    tacos.enableBody = true;
    // tacos.scale.setAll(0.05, 0.05);
    // tacos.setAll("outOfBoundsKill", true);
    // tacos.setAll("checkWorldBounds", true);
    tacos.checkWorldBounds = true;
    tacos.outOfBoundsKill = true;

    //  Here we'll create 12 of them evenly spaced apart
    this.makeTaco();

    game.add.text(0, 0, `${game.state.current}`);
    // game.camera.deadzone = new Phaser.Rectangle(centerX - 400, 0, 600, 700);
  }

  makeTaco() {
    for (var i = 0; i < 3; i++) {
      //  Create a taco inside of the 'tacos' group
      console.log(tacos.length, "tacoslength");

      taco = tacos.create(Math.random() * 800, Math.random() * 600, "taco"); //position off screen when scroll works
      taco.scale.setTo(0.05, 0.05);
      taco.checkWorldBounds = true;
      taco.outOfBoundsKill = true;
      // taco.body.collideWorldBounds = true;
      taco.events.onOutOfBounds.add(this.removeFromGroup);

      //  Let gravity do its thing
      taco.body.gravity.y = Math.random() * 300;
      taco.body.gravity.x = Math.random() * -300;
      // this.move(taco);
      //  This just gives each taco a slightly random bounce value
      // taco.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
  }
  removeFromGroup(taco) {
    tacos.remove(taco);
  }
  move(taco) {
    if (taco.y === 100) {
      //	Here you'll notice we are using a relative value for the tween.
      //	You can specify a number as a string with either + or - at the start of it.
      //	When the tween starts it will take the sprites current X value and add +300 to it.

      game.add
        .tween(taco)
        .to({ y: "+300" }, 2000, Phaser.Easing.Linear.None, true);
    } else if (taco.y === 400) {
      game.add
        .tween(taco)
        .to({ y: "-300" }, 2000, Phaser.Easing.Linear.None, true);
    }
  }

  update() {
    //moving background
    background.tilePosition.x -= 2;
    // tacosss.body.velocity.y -= 2;

    guy.animations.play("walk", 14, true);

    if (tacos.length < 3) {
      this.makeTaco();
      console.log(tacos.length < 3, "tacos.length<3");
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && guy.body.onFloor()) {
      guy.body.velocity.y = -400;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      guy.scale.setTo(2, 2);
      guy.x += speed;
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
}
