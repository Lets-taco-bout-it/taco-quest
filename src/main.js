import "pixi";
import "p2";
import Phaser from "phaser";

import BootState from "./states/Boot";
import LevelONE from "./states/LevelONE";
import HighScore from "./states/HighScore";
import LevelTWO from "./states/LevelTWO";
import HighScore2 from "./states/HighScore2";

// import MaxsLevel3 from "./states/MaxsLevel3";
import LevelTHREE from "./states/LevelTHREE";
import gameOver from "./states/gameOver";

import config from "./config";

import introState from "./states/intro";

class Game extends Phaser.Game {
  constructor() {
    const width = config.gameWidth;

    const height = config.gameHeight;

    super(width, height, Phaser.AUTO, "content", null);

    this.state.add("Boot", BootState, false);
    this.state.add("intro", introState, false);
    this.state.add("HighScore", HighScore, false);
    this.state.add("LevelONE", LevelONE, false);
    this.state.add("LevelTWO", LevelTWO, false);
    this.state.add("HighScore2", HighScore2, false);

    // this.state.add("MaxsLevel3", MaxsLevel3, false);
    this.state.add("LevelTHREE", LevelTHREE, false);
    this.state.add("gameOver", gameOver, false);

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start("Boot");
    }
  }
}

window.game = new Game();

if (window.cordova) {
  var app = {
    initialize: function() {
      document.addEventListener(
        "deviceready",
        this.onDeviceReady.bind(this),
        false
      );
    },

    // deviceready Event Handler
    //
    onDeviceReady: function() {
      this.receivedEvent("deviceready");

      // When the device is ready, start Phaser Boot state.
      window.game.state.start("Boot");
    },

    receivedEvent: function(id) {
      console.log("Received Event: " + id);
    }
  };

  app.initialize();
}
