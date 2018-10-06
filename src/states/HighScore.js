import Phaser from "phaser";
import { switchState } from "../utils";
import axios from "../../node_modules/axios";

var centerX = 800 / 2,
  centerY = 600 / 2,
  background,
  BASE_URL = "http://localhost:4000";

export default class extends Phaser.State {
  constructor() {
    super();

    this.highScores = [];
  }

  init() {
    axios({
      method: "GET",
      url: BASE_URL + "/api/lvl1"
    }).then(res => {
      console.log(res, "response");
      this.highScores = res.data;
      //display highscores

      this.createHighScore();
    });
  }

  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
  }
  create() {
    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);
    background.tint = 0x777777;
  }
  //.forEach(this.highScores)
  createHighScore() {
    console.log("add text");
    game.add.text(centerX, 0, `${this.highScores[0].initials}`, style);
    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    console.log(this.highScores, "HIGHSCORE");
  }
  update() {}
}
