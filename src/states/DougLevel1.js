import Phaser from "phaser";
import { switchState } from "../utils";

var centerX = windowWidth / 2,
  centerY = 600 / 2,
  windowHeight,
  windowWidth,
  guy,
  background,
  tacos,
  taco,
  scoreText,
  office,
  score = 0,
  cursors,
  speed = 4;

export default class extends Phaser.State {
  constructor() {
    super();
  }
  preload() {
    game.load.image("CityBG", "src/assets/CityBG.png");
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    game.load.image("taco", "src/assets/taco.png");
    game.load.spritesheet(
      "tacocat",
      "src/assets/tacocatspritesheet.png",
      32,
      32,
      17
    );
    game.load.image("office", "src/assets/officebuilding.png");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Background
    background = game.add.tileSprite(-500, 0, 5000, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);
    console.log(background.tilePosition.y);

    //Guy
    guy = game.add.sprite(100, 525, "guy");
    guy.scale.setTo(2, 2);
    guy.anchor.setTo(0.5, 0.5);
    guy.animations.add("walk", [0, 1, 2, 3, 4]);
    game.camera.follow(guy);

    //Wold Bounds
    game.world.setBounds(windowWidth + guy.position.x, 0, windowWidth * 2, 560);

    //Guy Physics Elements
    game.physics.enable(guy);
    guy.body.gravity.y = 800;
    guy.body.collideWorldBounds = true;

    //lists current game state
    game.add.text(0, 0, `${game.state.current}`);

    //Score
    scoreText = game.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000"
    });
    scoreText.fixedToCamera = true;

    //tacos
    tacos = game.add.group();
    tacos.enableBody = true;
    tacos.checkWorldBounds = true;
    tacos.outOfBoundsKill = true;

    //  Make taco loop envoked
    this.makeTaco();
  }

  update() {
    //moving background comment out to platform instead of sidescroll
    background.tilePosition.x -= 2;
    guy.animations.play("walk", 14, true);
    game.physics.arcade.collide(tacos);
    game.physics.arcade.overlap(guy, tacos, this.collectTaco, null, this);
    // console.log(guy.position.x, "GUY POSITION");

    //Win function runs for set score
    if (score === 5) {
      this.win();
    }
    //autogenerates tacos when tacos.length is < number
    if (tacos.length < 13) {
      this.makeTaco();
      console.log(tacos.length < 13, "tacos.length<3");
    }
    //Jump
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && guy.body.onFloor()) {
      guy.body.velocity.y = -400;
    }
    //RIGHT, LEFT MOVEMENT
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      guy.scale.setTo(2, 2);
      guy.x += speed * 3;
      // guy.animations.play("walk", 14, true);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      guy.scale.setTo(-2, 2);
      guy.x -= speed * 3;
      // guy.animations.play("walk", 14, true);
    }
    //SWITCH STATES ON 'S'
    else if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      switchState();
    }
  }

  //FUNCTIONS
  makeTaco() {
    for (var i = 0; i < 13; i++) {
      // console.log(tacos.length, "tacoslength");

      taco = tacos.create(Math.random() * 5000, Math.random() * 600, "taco");
      //for fixed position remove move() and set to i * 70, Math.random() * 200, 'taco'
      taco.scale.setTo(0.05, 0.05);
      taco.checkWorldBounds = true;
      taco.outOfBoundsKill = true;
      taco.events.onOutOfBounds.add(this.removeFromGroup);

      //  Optional taco gravity
      taco.body.gravity.y = Math.random() * 300;
      taco.body.gravity.x = Math.random() * -300;
    }
  }
  //remove tacos from group when collected or off world bounds
  removeFromGroup(taco) {
    tacos.remove(taco);
  }

  //Move taco animation for taco hurricane
  move(taco) {
    if (taco.y === 100) {
      game.add
        .tween(taco)
        .to({ y: "+300" }, 2000, Phaser.Easing.Linear.None, true);
    } else if (taco.y === 400) {
      game.add
        .tween(taco)
        .to({ y: "-500" }, 2000, Phaser.Easing.Linear.None, true);
    }
  }
  //collects and counts tacos, removes from group
  collectTaco(guy, taco) {
    //removes taco
    taco.kill();
    this.removeFromGroup(taco);
    //  Add and update the score
    score += 1;
    scoreText.text = "Score: " + score;
  }
  //winscreen function
  win() {
    //sets(x corner to half of the guy position)
    game.world.setBounds(guy.position.x / 2, 0, 2000, 560);

    //create office building at end of world
    office = game.add.image(1900, -10, "office");

    //Stop scroll
    // background.tilePosition.x = 0;

    //timer to switch state
  }
}
