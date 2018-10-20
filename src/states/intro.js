import Phaser from "phaser";
import { switchState } from "../utils";

export default class extends Phaser.State {
  constructor() {
    super();

    this.content = [
      "Pete has been late getting back from lunch every day this week.",
      "Pete will be fired if he is late one more time.",
      "Collect all the tacos and get back to work before the time runs out."
    ];
    this.line = [];
    this.wordIndex = 0;
    this.lineIndex = 0;
    this.guy;
    this.wordDelay = 120;
    this.lineDelay = 400;
    this.text;
    this.background;
    this.scroll = false;
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
  }

  create() {
    this.background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    this.background.anchor.setTo(0, 0);
    this.background.scale.setTo(1.5, 1.5);

    // game.add.image(0, 0, "CityBG");
    this.text = game.add.text(32, 32, "", {
      font: "25px Roboto Mono",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: "4"
    });

    this.nextLine();
  }

  update() {
    // if ( === content.length -1) {
    //   startScroll;
    // }

    if (this.scroll === true) {
      this.background.tilePosition.y -= 2;

      if (this.background.tilePosition.y <= -551) {
        this.scroll = false;

        setTimeout(switchState, 1000);

        this.guy = game.add.sprite(100, 525, "guy");
        this.guy.scale.setTo(2, 2);
        this.guy.anchor.setTo(0.5, 0.5);
      }
    }

    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      switchState();
    }
  }

  nextLine() {
    if (this.lineIndex === this.content.length) {
      this.content = [];
      this.scroll = true;
      return;
    }

    //  Split the current line on spaces, so one word per array element
    this.line = this.content[this.lineIndex].split(" ");

    //  Reset the word index to zero (the first word in the line)
    this.wordIndex = 0;

    //  Call the 'nextWord' function once for each word in the line (line.length)
    game.time.events.repeat(
      this.wordDelay,
      this.line.length,
      this.nextWord,
      this
    );

    //  Advance to the next line
    this.lineIndex++;
  }

  nextWord() {
    //  Add the next word onto the text string, followed by a space
    this.text.text = this.text.text.concat(this.line[this.wordIndex] + " ");

    //  Advance the word index to the next word in the line
    this.wordIndex++;

    //  Last word?
    if (this.wordIndex === this.line.length) {
      //  Add a carriage return
      this.text.text = this.text.text.concat("\n");

      //  Get the next line after the lineDelay amount of ms has elapsed
      game.time.events.add(this.lineDelay, this.nextLine, this);
    }
  }
  // render() {
  //   game.debug.cameraInfo(game.camera, 32, 32);
  // }
}
