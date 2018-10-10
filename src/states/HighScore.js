import Phaser from "phaser";
import { switchState, calculateGameScore } from "../utils";
import axios from "../../node_modules/axios";
import PhaserInput from "phaser-input";

var centerX = 800 / 2,
  centerY = 600 / 2,
  background,
  input,
  inputBox,
  inputHandler,
  BASE_URL = "http://localhost:4000";

export default class extends Phaser.State {
  constructor() {
    super();

    this.highScores = [];
    this.initials = "";
    this.score = "";
  }

  init() {
    //sets score
    // this.score = game.time.totalElapsedSeconds();
    this.score = calculateGameScore.score;
    console.log(this.score, "SCOREINHS", calculateGameScore.score, "CCGS");
    //gets highscores from table
    axios({
      method: "GET",
      url: BASE_URL + "/api/lvl1"
    }).then(res => {
      this.highScores = res.data;

      this.createHighScore();
    });
  }

  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.add.plugin(PhaserInput.Plugin);
  }
  create() {
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
    game.add.text(90, 0, `${this.score}`, style);

    //INPUT BOX
    input = game.add.inputField(centerX, 90);
    inputBox = game.add.inputField(centerX, 90, {
      font: "18px Arial",
      fill: "#212121",
      fontWeight: "bold",
      width: 150,
      padding: 8,
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 6,
      placeHolder: "Initials",
      max: 3,
      type: PhaserInput.InputType.text
    });
    console.log("game score", calculateGameScore.score);
  }

  update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      this.initials = inputBox.value;
      console.log(inputBox.value, "VALUE", this.initials, "initials");
    }
  }

  //FUNCTIONS
  //.forEach(this.highScores)
  createHighScore() {
    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    game.add.text(centerX, 0, `${this.highScores[0].initials}`, style);
  }
}
