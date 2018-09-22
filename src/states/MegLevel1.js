import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  background,
  speed = 4,
  timer,
  clock = 2,
  text,
  boss,
  bossWalk,
  gameOver;

export default class extends Phaser.State {
  constructor() {
    super();
    //keep track of variables here
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    game.load.spritesheet("boss", "src/assets/boss.png", 75, 120);
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

    game.add.text(0, 0, `${game.state.current}`);

    timer = game.time.create(false);

    const updateClock = () => {
      clock -= 2;
      text.setText(`minutes remaining: ${clock}`);
    };

    timer.loop(1000, updateClock, this);

    timer.start();

    text = game.add.text(centerX, 0, `minutes remaining: ${clock}`, {
      font: "bold 30px Roboto Mono",
      fill: "#483E37",
      boundsAlignH: "center",
      boundsAlignV: "top"
    });

    //boss
    boss = game.add.sprite(780, 530, "boss");
    boss.scale.setTo(0.5, 0.5);
    boss.anchor.setTo(0.5, 0.5);
    game.physics.enable(boss);

    //boss animation
    bossWalk = boss.animations.add("bossWalk", [4, 5, 6, 7]);
    bossWalk.play(14, true);

    // game.camera.deadzone = new Phaser.Rectangle(centerX - 400, 0, 600, 700);
  }

  update() {
    //boss walks across screen
    boss.body.velocity.x -= 2;
    //moving background
    guy.animations.play("walk", 14, true);

    guy.animations.play("walk", 14, true);

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
    //when time runs out, invoke gameOver function
    clock <= 0 ? this.gameOver() : null;
  }

  gameOver() {
    timer.stop();

    guy.animations.stop(null, true);
    guy.tint = 0x777777;
  }
}
