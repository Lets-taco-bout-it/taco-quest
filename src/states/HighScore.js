import Phaser from "phaser";
import { switchState } from "../utils";
import axios from "../../node_modules/axios";

export default class extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    axios({
      method: "GET",
      url: "/api/scores"
    }).then(res => {
      //display highscores
    });
  }
}
