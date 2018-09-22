import Phaser from "phaser";
import { switchState, toggleMute } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  background,
  welcomeText,
  startBtn,
  music,
  muteToggleBtn,
  sound = true;

export default class extends Phaser.State {
  constructor() {
    super();
  }

  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    game.load.spritesheet("start", "src/assets/playButtonSheet.png", 209, 96);
    game.load.audio("themeSong", "src/assets/sounds/themesong.wav");
    game.load.spritesheet("mute", "/src/assets/soundToggleSheet.png", 96, 96);
    game.load.audio("gameSong", "src/assets/sounds/gameSong.wav");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1400, 560);

    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);
    background.tint = 0x777777;

    //MUSIC AUTO PLAY ON GAME LOAD
    music = game.add.audio("themeSong");
    music.loop = true;
    music.play();

    //WELCOME TO TACO QUEST TEXT AND STYLING
    game.add.text(centerX, 0, `${game.state.current}`);
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

    //PLAY BUTTON
    let actionOnClick = () => {
      switchState();
      music.destroy();
    };

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
  }

  update() {
    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      music.destroy();
      switchState();
    }

    //MUTE-UNMUTE TOGGLE BUTTON

    let toggleMute = () => {
      if (sound) {
        sound = !sound;
        music.pause();
      } else {
        sound = !sound;
        music.resume();
      }
    };

    if (sound) {
      muteToggleBtn = game.add.button(
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
      muteToggleBtn = game.add.button(
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
    muteToggleBtn.scale.setTo(0.3, 0.3);
  }
}
