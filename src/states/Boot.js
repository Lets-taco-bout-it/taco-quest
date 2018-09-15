import Phaser from "phaser";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  background,
  speed = 4,
  welcomeText,
  startBtn,
  music;

export default class extends Phaser.State {
  constructor() {
    super();
    //keep track of variables here
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    game.load.spritesheet("start", "src/assets/playButtonSheet.png", 209, 96);
    game.load.audio("themeSong", "src/assets/sounds/themesong.wav");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1400, 600);

    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);
    background.tint = 0x777777;

    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    welcomeText = background.game.add.text(
      0,
      0,
      "WELCOME TO TACO QUEST!",
      style
    );
    welcomeText.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);
    welcomeText.setTextBounds(0, 150, 800, 100);

    let actionOnClick = () => {};

    startBtn = game.add.button(
      centerX - 105,
      centerY,
      "start",
      actionOnClick,
      this,
      2,
      0,
      1,
      0
    );

    music = game.add.audio("themeSong");
    music.play();

    // guy = game.add.sprite(20, 525, "guy");
    // guy.scale.setTo(2, 2);
    // guy.anchor.setTo(0.5, 0.5);
    // guy.animations.add("walk", [0, 1, 2, 3, 4]);
    // game.camera.follow(guy);
    // game.physics.enable(guy);
    // guy.body.collideWorldBounds = true;

    // game.camera.deadzone = new Phaser.Rectangle(centerX - 400, 0, 600, 700);
  }

  update() {
    // //moving background
    // background.tilePosition.x -= 2;
    // guy.animations.play("walk", 14, true);
    // if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    //   guy.scale.setTo(2, 2);
    //   guy.x += speed;
    //   // guy.animations.play("walk", 14, true);
    // } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    //   guy.scale.setTo(-2, 2);
    //   guy.x -= speed;
    //   // guy.animations.play("walk", 14, true);
    // } else {
    //   // guy.animations.stop("walk");
    //   // guy.frame = 0;
    // }
  }
}
