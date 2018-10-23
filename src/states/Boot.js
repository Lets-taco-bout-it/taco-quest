import Phaser from "phaser";
import { switchState, toggleMute } from "../utils";

export default class extends Phaser.State {
  constructor() {
    super();

    this.centerX = 800 / 2;
    this.centerY = 600 / 2;
    this.background;
    this.welcomeText;
    this.startBtn;
    this.music;
    this.muteToggleBtn;
  }

  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    game.load.spritesheet("start", "src/assets/playButtonSheet.png", 209, 96);
    game.load.audio("themeSong", "src/assets/sounds/themesong.wav");
    game.load.spritesheet("mute", "src/assets/soundToggleSheet.png", 96, 96);
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1400, 560);

    this.background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    this.background.anchor.setTo(0, 0.51);
    this.background.scale.setTo(1.5, 1.5);
    this.background.tint = 0x777777;

    //this.music AUTO PLAY ON GAME LOAD
    this.music = game.add.audio("themeSong");
    this.music.loop = true;
    this.music.play();

    //WELCOME TO TACO QUEST TEXT AND STYLING
    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: "6",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    this.welcomeText = this.background.game.add.text(
      0,
      0,
      "WELCOME TO TACO QUEST!",
      style
    );
    this.welcomeText.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);
    this.welcomeText.setTextBounds(0, 150, 800, 100);

    //PLAY BUTTON
    let actionOnClick = () => {
      switchState();
    };

    this.startBtn = game.add.button(
      this.centerX - 105,
      this.centerY,
      "start",
      actionOnClick,
      this,
      2,
      0,
      1,
      0
    );
  }

  update() {
    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      switchState();
    }

    //MUTE-UNMUTE TOGGLE BUTTON

    let toggleMute = () => {
      if (!game.sound.mute) {
        game.sound.mute = true;
      } else {
        game.sound.mute = false;
      }
    };

    if (!game.sound.mute) {
      this.muteToggleBtn = game.add.button(
        5,
        5,
        "mute",
        toggleMute,
        this,
        2,
        0,
        4,
        1
      );
    } else {
      this.muteToggleBtn = game.add.button(
        5,
        5,
        "mute",
        toggleMute,
        this,
        3,
        1,
        5,
        0
      );
    }
    this.muteToggleBtn.scale.setTo(0.3, 0.3);
  }
}
