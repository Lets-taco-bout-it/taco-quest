import Phaser from "phaser";

export default class extends Phaser.State {
  constructor() {
    super();
    //keep track of variables here
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
  }

  create() {
    this.background = game.add.sprite(0, 0.4, "CityBG");
    this.background.anchor.setTo(0, 0.51);
    this.background.scale.setTo(1.5, 1.5);
  }

  update() {}
}
