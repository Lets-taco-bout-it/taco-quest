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
  submitBtn,
  BASE_URL = "http://localhost:4000";

export default class extends Phaser.State {
  constructor() {
    super();

    this.highScores = [];
    this.phaserScores = [];
    this.initials = "";
    this.score = "";
  }

  init() {
    //sets score
    this.score = calculateGameScore.score;
    //gets highscores from table
    axios({
      method: "GET",
      url: BASE_URL + "/api/lvl1"
    }).then(res => {
      this.highScores = res.data;
      console.log(this.highScores, "ALLHIGHSCORES");

      this.createHighScore();
    });
  }

  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.add.plugin(PhaserInput.Plugin);
    game.load.spritesheet(
      "submitButton",
      "src/assets/achievement_spriteSheet.png",
      48,
      48
    );
  }
  create() {
    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);
    background.tint = 0x777777;

    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: "6",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    game.add.text(90, 0, `Your Score ${this.score}`, style);

    //INPUT BOX
    input = game.add.inputField(centerX, 15);
    inputBox = game.add.inputField(centerX, 15, {
      font: "18px Arial",
      fill: "#212121",
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: "6",
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

    //SUBMIT BUTTON
    let submitHandler = () => {
      //sets initials
      this.clearHighScore();
      this.initials = inputBox.value;
      console.log("button clicked", this.initials);
      axios({
        method: "POST",
        url: BASE_URL + "/api/lvl1",
        data: { score: this.score, initials: this.initials }
      }).then(res => {
        console.log(200, "added highscore");

        axios({
          method: "GET",
          url: BASE_URL + "/api/lvl1"
        }).then(res => {
          this.highScores = res.data;
          console.log(this.highScores, "ALLHIGHSCORES");

          this.createHighScore();
        });
      });
    };
    submitBtn = game.add.button(
      centerX + 167,
      10,
      "submitButton",
      submitHandler,
      this,
      1, //hover
      0, //normal
      2, //clicked
      0 //normal
    );
  }

  update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      console.log(inputBox.value, "VALUE", this.initials, "initials");
    }
    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      switchState();
      // score = 0;
    }
  }

  //FUNCTIONS

  clearHighScore() {
    this.phaserScores.forEach(score => score.destroy());
  }

  createHighScore() {
    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: "6",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    game.add.text(centerX - 150, 70, `HIGH SCORES`, style);
    this.phaserScores.push(
      game.add.text(
        centerX - 100,
        130,
        `1. ${this.highScores[0].initials} ${this.highScores[0].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        170,
        `2. ${this.highScores[1].initials} ${this.highScores[1].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        210,
        `3. ${this.highScores[2].initials} ${this.highScores[2].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        250,
        `4. ${this.highScores[3].initials} ${this.highScores[3].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        290,
        `5. ${this.highScores[4].initials} ${this.highScores[4].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        330,
        `6. ${this.highScores[5].initials} ${this.highScores[5].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        370,
        `7. ${this.highScores[6].initials} ${this.highScores[6].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        410,
        `8. ${this.highScores[7].initials} ${this.highScores[7].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        450,
        `9. ${this.highScores[8].initials} ${this.highScores[8].score}`,
        style
      ),
      game.add.text(
        centerX - 100,
        490,
        `10. ${this.highScores[9].initials} ${this.highScores[9].score}`,
        style
      )
    );
  }
}
