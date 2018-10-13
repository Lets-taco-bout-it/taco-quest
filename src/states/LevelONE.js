import Phaser from "phaser";
import { switchState, calculateGameScore } from "../utils";

export default class extends Phaser.State {
  constructor() {
    super();
    this.restart = false;
    this.centerX = 800 / 2;
    this.centerY = 600 / 2;
    this.clock = 2;
    this.score = 0;
    this.speed = 10;
    this.stopBoss = false;
    this.fired = false;
    this.firedBubble;
    this.catBubble;
    this.boss;
    this.timerText;
    this.timer;
    this.trash;
    this.trashCans;
    this.office;
    this.scoreText;
    this.taco;
    this.tacos;
    this.background;
    this.catwalk;
    this.cats;
    this.cat;
    this.guy = {};
    this.isMoving;
  }

  init() {
    // this.guy.alive = true;
    // console.log(this.guy);
  }

  preload() {
    this.game.load.image("CityBG", "src/assets/CityBG.png");
    this.game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);

    this.game.load.image("taco", "src/assets/taco.png");
    this.game.load.image("office", "src/assets/officebuilding.png");
    //cat
    this.game.load.spritesheet(
      "cat",
      "src/assets/tacocatspritesheet.png",
      336,
      216
    );
    this.game.load.image("trash", "src/assets/dumpster3.png");
    this.game.load.image("manHole", "src/assets/manhole.png", 32, 32);
    this.game.load.spritesheet("boss", "src/assets/boss.png", 75, 120);
    this.game.load.image("firedBubble", "src/assets/firedBubble.png");
    this.game.load.image("catBubble", "src/assets/catBubble.png");
  }

  create() {
    // console.log("create");
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //maxworldbounds
    this.game.world.setBounds(0, 0, 2800, 560);

    //Background
    this.background = this.game.add.tileSprite(-500, 0, 5000, 1080, "CityBG");
    this.background.anchor.setTo(0, 0.51);
    this.background.scale.setTo(1.5, 1.5);

    //Guy
    this.guy = this.game.add.sprite(100, 525, "guy");
    this.guy.scale.setTo(2, 2);
    this.guy.anchor.setTo(0.5, 0.5);
    this.guy.animations.add("walk", [3, 4, 3, 0]);
    this.guy.animations.add("jump", [3, 2]);
    this.game.camera.follow(this.guy);

    //immunity flag sets if guy can take damage
    this.guy.immune = false;

    //Wold Bounds
    // this.game.world.setBounds(windowWidth + guy.position.x, 0, windowWidth * 2, 560);

    //Guy Physics Elements
    this.game.physics.enable(this.guy);
    this.guy.body.gravity.y = 800;
    this.guy.body.collideWorldBounds = true;

    //Lists current this.game state
    this.game.add.text(0, 0, `${this.game.state.current}`);

    //Score and Timer
    this.scoreText = this.game.add.text(
      16,
      16,
      "tacos collected: " + this.score,
      {
        fontSize: "32px",
        fill: "#000"
      }
    );
    this.scoreText.fixedToCamera = true;

    this.timer = this.game.time.create(false);

    const updateClock = () => {
      this.clock -= 2;
      this.timerText.setText(`minutes remaining: ${this.clock}`);
    };

    this.timer.loop(1000, updateClock, this);

    this.timer.start();

    this.timerText = this.game.add.text(
      this.centerX,
      0,
      `minutes remaining: ${this.clock}`,
      {
        font: "bold 30px Roboto Mono",
        fill: "black",
        boundsAlignH: "right",
        boundsAlignV: "top"
      }
    );
    this.timerText.fixedToCamera = true;

    //boss
    this.boss = this.game.add.sprite(780, 530, "boss");
    this.boss.scale.setTo(0.5, 0.5);
    this.boss.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.boss);
    this.boss.animations.add("bossWalk", [4, 5, 6, 7]);
    this.boss.animations.play("bossWalk", 14, true);
    this.boss.visible = false;

    //TRASHCANS
    this.trashCans = this.game.add.physicsGroup();
    this.trashCans.enableBody = true;
    this.trashCans.checkWorldBounds = true;
    this.trashCans.outOfBoundsKill = true;
    this.makeTrash();

    //Tacos
    this.tacos = this.game.add.group();
    this.tacos.enableBody = true;
    this.tacos.checkWorldBounds = true;
    this.tacos.outOfBoundsKill = true;

    //cat group
    this.cats = this.game.add.group();
    this.cats.enableBody = true;
    this.cats.checkWorldBounds = true;
    this.cats.outOfBoundsKill = true;

    this.makeCats();

    //  Make taco loop envoked
    this.makeTaco();
  }

  update() {
    this.isMoving = true;

    if (this.score <= 0) {
      this.score = 0;
      this.scoreText.text = "tacos collected: " + this.score;
    }

    //KILL TIMER PLACEHOLDER if (this.timer === 0) {this.guy.alive = false}
    //when time runs out, invoke this.gameOver function
    if (this.clock <= 0 && this.score < 10) {
      this.gameOver();
    }

    if (!this.guy.alive) {
      this.trashCans.kill();
      this.cats.kill();
      this.tacos.kill();
    }

    //this.win() runs and guy walks to building

    if (this.guy.alive === false && this.score >= 0) {
      this.guy.body.velocity.x += 4;
      this.guy.scale.setTo(2, 2);
      //  You can set your own fade color and duration
      this.game.time.events.add(Phaser.Timer.SECOND * 4, this.cameraFade, this);
    }

    if (this.guy.alive === true) {
      this.game.physics.arcade.collide(this.guy, this.trashCans);
      this.game.physics.arcade.collide(
        this.guy,
        this.cats,
        this.collideCat,
        null,
        this
      );
      this.game.physics.arcade.overlap(
        this.guy,
        this.tacos,
        this.collectTaco,
        null,
        this
      );

      if (this.isMoving === true) {
        //moving background
        this.background.tilePosition.x -= 2;
        this.trashCans.children.forEach(can => {
          can.body.velocity.x = -175;
        });
      } else {
        this.trashCans.children.forEach(can => {
          can.body.velocity.x = 0;
        });
      }

      //Set Score and win function runs

      if (this.clock <= 0 && this.score >= 10) {
        this.win();
      }

      //autogenerates tacos when tacos.length is < number
      if (this.tacos.length < 10) {
        this.makeTaco();
      }

      // cat boundaries
      this.cats.children.map(cat => {
        if (cat.body.position.x <= 20) {
          this.removeCatFromGroup(cat);
          cat.kill();
        }
      });

      //regenerates cats
      if (this.cats.length < 8) {
        this.makeCats();
      }

      //cat speed
      this.cats.x -= 5;

      //Jump
      if (this.guy.body.blocked.down || this.guy.body.touching.down) {
        this.guy.animations.play("walk", 14, true);

        if (
          this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
          this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
        ) {
          this.guy.animations.stop("walk");
          this.guy.animations.play("jump");
          this.guy.body.velocity.y = -500;
        }
      }
      //RIGHT, LEFT MOVEMENT
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.guy.scale.setTo(2, 2);
        this.guy.body.velocity.x += this.speed;
        if (this.guy.body.velocity.x > 150) {
          this.guy.body.velocity.x = 150;
        }
      } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.guy.scale.setTo(-2, 2);
        this.guy.body.velocity.x -= this.speed * 2;
        if (this.guy.body.velocity.x < -150) {
          this.guy.body.velocity.x = -150;
        }
      } else {
        this.guy.body.velocity.x = 0;
      }
    }
    //SWITCH STATES ON 'S'
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      switchState();
      score = 0;
    }
    //invoke win function on 'W' - must have enough tacos
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.W)) {
      this.win();
    }

    //delayed level restart after boss fires guy
    if (this.restart) {
      this.restart = false;
      setTimeout(this.restartLevel.bind(this), 2000);
    }
    //stops boss from pushing guy after collision
    if (this.stopBoss) {
      this.boss.body.velocity.x = 0;
    }

    if (this.fired === true) {
      this.youreFired();
    }
  }

  //FUNCTIONS

  gameOver() {
    this.timer.stop();
    this.guy.alive = false;
    this.guy.animations.stop(null, true);
    this.guy.tint = 0x777777;
    this.guy.body.velocity.x = 0;
    this.game.physics.arcade.collide(
      this.guy,
      this.boss,
      () => {
        this.fired = true;
      },
      null,
      this
    );

    //boss animation walking
    this.boss.visible = true;
    this.boss.body.velocity.x -= 2;
  }

  //boss fires guy text bubble
  youreFired() {
    this.stopBoss = true;
    this.boss.animations.stop(null, true);

    this.firedBubble = this.game.add.sprite(
      this.boss.body.position.x - 5,
      this.boss.body.position.y - 75,
      "firedBubble"
    );
    this.firedBubble.scale.setTo(0.7);

    //invokes restartLevel in update function
    this.restart = true;
    console.log("youre fired");
  }

  restartLevel() {
    // this.clock = 60;
    // this.guy.alive = true;
    // this.game.state.restart(true, false);
    // console.log("restarting");
  }

  makeTrash() {
    let min = 1000;
    for (var i = 0; i < 6; i++) {
      const randomNumber = () => {
        // 200 is the range (plus min)
        const num = Math.random() * 200 + min;
        // min adjusts distance between trash
        min += 1450;
        return num;
      };
      let roll = randomNumber();

      this.trash = this.trashCans.create(roll, 470, "trash");

      this.trash.scale.setTo(0.7, 0.7);
      this.trash.body.velocity.x = -175;
      this.trash.body.immovable = true;
    }
  }

  makeCats() {
    let min = 700;
    for (var i = 0; i < 8; i++) {
      const randomNum = () => {
        const num = Math.random() * 200 + min;
        min += 1450;
        return num;
      };

      let roll = randomNum();

      this.cat = this.cats.create(roll, 800, "cat");
      this.game.physics.enable(this.cat);
      this.cat.scale.setTo(-0.2, 0.2);
      this.cat.anchor.setTo(0.5, 0.5);
      this.cat.enableBody = true;
      this.cat.checkWorldBounds = true;
      this.cat.outOfBoundsKill = true;
      this.cat.events.onOutOfBounds.add(this.removeCatFromGroup, this);
      this.catWalk = this.cat.animations.add("catWalk", [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ]);
      this.catWalk.play(17, true);

      this.cat.body.gravity.y = 800;
      this.cat.body.collideWorldBounds = true;
      // cat.body.bounce.y = 1;
      //0.9 + Math.random() * 0.2;
      // cat.body.velocity.x = -1;
    }
  }

  collideCat(guy, cat) {
    if (guy.deltaY > cat.deltaY && guy.body.touching.down) {
      //IF GUY COLLIDES ON TOP OF CAT
      cat.body.velocity.x = 0;
      cat.kill();
    } else if (!guy.immune) {
      guy.immune = true;
      guy.alpha = 0.5;
      cat.alpha = 0.5;
      this.score -= 1;
      this.scoreText.text = "tacos collected: " + this.score;

      //adds cat 'thanks' speech bubble
      this.catBubble = this.game.add.sprite(
        cat.body.position.x - 5,
        cat.body.position.y - 75,
        "catBubble"
      );
      this.catBubble.scale.setTo(0.7);

      //sets timer for immunity and cat bubble
      this.game.time.events.add(
        700,
        () => {
          guy.immune = false;
          guy.alpha = 1;
          this.catBubble.alpha = 0;
        },
        this
      );
    }

    //FLASH GUY
    //GUY SITS
    //NOISE TRIGGERED
  }

  removeCatFromGroup(cat) {
    this.cats.remove(cat);
  }

  makeTaco() {
    for (var i = 0; i < 15; i++) {
      this.taco = this.tacos.create(Math.random() * 5000, -5, "taco");
      //for fixed position remove move() and set to i * 70, Math.random() * 200, 'taco'
      this.taco.scale.setTo(0.05, 0.05);
      this.taco.checkWorldBounds = true;
      this.taco.outOfBoundsKill = true;
      this.taco.events.onOutOfBounds.add(this.removeFromGroup, this);

      //  Optional taco gravity
      this.taco.body.gravity.y = Math.random() * 300;
    }
  }
  //remove tacos from group when collected or off world bounds
  removeFromGroup(taco) {
    this.tacos.remove(taco);
  }

  //Move taco animation for taco hurricane
  move(taco) {
    if (taco.y === 100) {
      this.game.add
        .tween(taco)
        .to({ y: "+300" }, 2000, Phaser.Easing.Linear.None, true);
    } else if (taco.y === 400) {
      this.game.add
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
    this.score += 1;
    this.scoreText.text = "tacos collected: " + this.score;
  }
  //win screen function
  win() {
    this.guy.alive = false;
    this.timer.stop();
    this.game.world.setBounds(0, 0, 2000, 560);
    //create office building at end of world
    this.office = this.game.add.image(1700, -20, "office");
    calculateGameScore.get(this.timer, 10);
  }
  cameraFade() {
    this.game.camera.fade(0x000000, 5000);
    // switchState();
  }

  // render() {
  //   // if (showDebug)
  //   // {
  //   this.game.debug.bodyInfo(guy, 32, 32);
  //   this.game.debug.body(guy);
  //   // }
  // }
}
