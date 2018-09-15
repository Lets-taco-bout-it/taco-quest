import Phaser from "phaser";

var content = [
  "You have been late getting back from lunch every day this week.",
  "You will be fired if you are late one more time.",
  "Collect all the tacos and get back to work before the time runs out."
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 120;
var lineDelay = 400;
var text;
var nextLine;

export default class extends Phaser.State {
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
  }
  create() {
    game.add.image(0, 0, "CityBG");
    text = game.add.text(32, 32, "", { font: "25px Arial", fill: "#777777" });
    console.log(lineIndex, content.length);
    this.nextLine();
  }

  nextLine() {
    if (lineIndex === content.length) {
      console.log("exiting next line");
      //  We're finished
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
}
