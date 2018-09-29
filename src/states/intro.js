import Phaser from "phaser";
import { switchState } from "../utils";

var content = [
  "You have been late getting back from lunch every day this week.",
  "You will be fired if you are late one more time.",
  "Collect all the tacos and get back to work before the time runs out."
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;
var guy;
var wordDelay = 120;
var lineDelay = 400;
var text;
var nextLine;
var CityBG;
var background;
var endScroll;
var tilePosition;
var scroll = false;

export default class extends Phaser.State {
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
  }

  create() {
    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0);
    background.scale.setTo(1.5, 1.5);

    text = game.add.text(32, 32, "", { font: "25px Arial", fill: "#777777" });

    this.nextLine();
  }

  update() {
    // if ( === content.length -1) {
    //   startScroll;
    // }

    if (scroll === true) {
      background.tilePosition.y -= 2;

      if (background.tilePosition.y <= -551) {
        scroll = false;
        guy = game.add.sprite(100, 525, "guy");
        guy.scale.setTo(2, 2);
        guy.anchor.setTo(0.5, 0.5);

        //will auto switch state when scroll hits the bottom
        // switchState();
        // return background.anchor.setTo(0, 0.51);
      }
    }

    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      switchState();
    }
  }

  nextLine() {
    if (lineIndex === content.length) {
      content = [];
      scroll = true;
      return;
    }

    //  Split the current line on spaces, so one word per array element
    line = content[lineIndex].split(" ");

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0;

    //  Call the 'nextWord' function once for each word in the line (line.length)
    game.time.events.repeat(wordDelay, line.length, this.nextWord, this);

    //  Advance to the next line
    lineIndex++;
  }

  nextWord() {
    //  Add the next word onto the text string, followed by a space
    text.text = text.text.concat(line[wordIndex] + " ");

    //  Advance the word index to the next word in the line
    wordIndex++;

    //  Last word?
    if (wordIndex === line.length) {
      //  Add a carriage return
      text.text = text.text.concat("\n");

      //  Get the next line after the lineDelay amount of ms has elapsed
      game.time.events.add(lineDelay, this.nextLine, this);
    }
  }
  // render() {
  //   game.debug.cameraInfo(game.camera, 32, 32);
  // }
}
