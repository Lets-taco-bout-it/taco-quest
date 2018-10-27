import Phaser from "phaser";
import { switchState, calculateGameScore } from "../utils";
import axios from "axios";
// import PhaserInput from "phaser-input";

export default class extends Phaser.State {
  constructor() {
    super();

    this.highScores = [];
    this.phaserScores = [];
    this.initials = "";
    this.score = "";
    this.centerX = 800 / 2;
    this.background;
    this.input;
    this.inputBox;
    this.inputHandler;
    this.submitBtn;
    this.BASE_URL = "http://localhost:4000";
    this.nextButton;
    this.muteToggleBtn;
  }

  init() {
    console.log("!!!INIT!!!");
    //sets score
    this.score = calculateGameScore.score;
    //gets highscores from table
    axios({
      method: "GET",
      url: this.BASE_URL + "/api/lvl1"
    }).then(res => {
      this.highScores = res.data;
      console.log(this.highScores, "ALLHIGHSCORES");

      this.createHighScore();
    });
  }

  preload() {
    console.log("!!!!PRELOAD!!!!!");
    this.game.load.image("CityBG", "src/assets/CityBG.png");
    // this.game.add.plugin(PhaserInput.Plugin);
    this.game.load.spritesheet(
      "submitButton",
      "src/assets/achievement_spriteSheet.png",
      48,
      48
    );
    this.game.load.spritesheet("nextButton", "src/assets/next.png", 96, 96);
    this.game.load.spritesheet(
      "mute",
      "src/assets/soundToggleSheet.png",
      96,
      96
    );
  }
  create() {
    console.log("!!!!CREATE!!!!");
    this.background = this.game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    this.background.anchor.setTo(0, 0.51);
    this.background.scale.setTo(1.5, 1.5);
    this.background.tint = 0x777777;

    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: "6",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    this.game.add.text(60, 0, `Your Score: ${this.score}`, style);

    // INPUT BOX
    // this.input = this.game.add.inputField(this.centerX, 15);
    // this.inputBox = this.game.add.inputField(this.centerX, 15, {
    //   font: "18px Arial",
    //   fill: "#212121",
    //   fontWeight: "bold",
    //   stroke: "#000000",
    //   strokeThickness: "6",
    //   width: 150,
    //   padding: 8,
    //   borderWidth: 1,
    //   borderColor: "#000",
    //   borderRadius: 6,
    //   placeHolder: "Initials",
    //   max: 3
    //   type: PhaserInput.InputType.text
    // });
    console.log("game score", calculateGameScore.score);

    //SUBMIT BUTTON
    let submitHandler = () => {
      //sets initials
      this.clearHighScore();
      this.initials = this.inputBox.value;
      console.log("button clicked", this.initials);
      axios({
        method: "POST",
        url: this.BASE_URL + "/api/lvl1",
        data: { score: this.score, initials: this.initials }
      }).then(res => {
        console.log(200, "added highscore");

        axios({
          method: "GET",
          url: this.BASE_URL + "/api/lvl1"
        }).then(res => {
          this.highScores = res.data;
          console.log(this.highScores, "ALLHIGHSCORES");

          this.createHighScore();
        });
      });
    };
    this.submitBtn = this.game.add.button(
      this.centerX + 170,
      10,
      "submitButton",
      submitHandler,
      this,
      1, //hover
      0, //normal
      2, //clicked
      0 //normal
    );

    //NEXT BUTTON
    this.nextButton = this.game.add.button(
      this.centerX + 250,
      250,
      "nextButton",
      switchState,
      this,
      1,
      0,
      2,
      0
    );
  }

  update() {
    console.log("!!!UPDATE!!!");
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      console.log(this.inputBox.value, "VALUE", this.initials, "initials");
    }
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      switchState();
      // score = 0;
    }

    //MUTE-UNMUTE TOGGLE BUTTON

    let toggleMute = () => {
      if (!this.game.sound.mute) {
        this.game.sound.mute = true;
      } else {
        this.game.sound.mute = false;
      }
    };

    if (!this.game.sound.mute) {
      this.muteToggleBtn = this.game.add.button(
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
      this.muteToggleBtn = this.game.add.button(
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
    this.muteToggleBtn.fixedToCamera = true;
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
    this.game.add.text(this.centerX - 250, 70, `LEVEL 1 HIGH SCORES`, style);
    this.phaserScores.push(
      this.game.add.text(
        this.centerX - 100,
        130,
        `1. ${this.highScores[0].initials} ${this.highScores[0].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        170,
        `2. ${this.highScores[1].initials} ${this.highScores[1].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        210,
        `3. ${this.highScores[2].initials} ${this.highScores[2].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        250,
        `4. ${this.highScores[3].initials} ${this.highScores[3].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        290,
        `5. ${this.highScores[4].initials} ${this.highScores[4].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        330,
        `6. ${this.highScores[5].initials} ${this.highScores[5].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        370,
        `7. ${this.highScores[6].initials} ${this.highScores[6].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        410,
        `8. ${this.highScores[7].initials} ${this.highScores[7].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        450,
        `9. ${this.highScores[8].initials} ${this.highScores[8].score}`,
        style
      ),
      this.game.add.text(
        this.centerX - 100,
        490,
        `10. ${this.highScores[9].initials} ${this.highScores[9].score}`,
        style
      )
    );
  }
}
