import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  guy,
  background,
  speed = 4,
  welcomeText,
  startBtn,
  music,
  music2;

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
    game.world.setBounds(0, 0, 1400, 560);

    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);
    background.tint = 0x777777;

    game.add.text(0, 0, `${game.state.current}`);
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
  }

  update() {
    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      switchState();
    }
  }
}
