import Phaser from "phaser";
import { switchState, calculateGameScore } from "../utils";

export default class extends Phaser.State {
  constructor() {
    super();
    this.restart = false;
    this.centerX = 800 / 2;
    this.centerY = 600 / 2;
    this.clock = 60;
    this.score = 0;
    this.speed = 10;
    this.stopBoss = false;
    this.stopGuy = false;
    this.fired = false;
    this.firedBubble;
    this.catBubble;
    this.boss;
    this.timerText;
    this.timer;
    this.trash;
    this.trashCans;
    this.manHole;
    this.manHoles;
    this.sign;
    this.signs;
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
    this.textStyle = {
      font: "bold 30px Roboto Mono",
      fontSize: "32px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: "4"
    };
    this.winSound;
    this.muteToggleBtn;
  }

  init() {}

  preload() {
    this.game.load.image("city3", "src/assets/cityLevel3.png", 995, 490);

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
    this.game.load.image("sign", "src/assets/sign.png");
    this.game.load.image("manHole", "src/assets/manhole.png", 32, 32);
    this.game.load.spritesheet("boss", "src/assets/boss.png", 75, 120);
    this.game.load.image("firedBubble", "src/assets/firedBubble.png");
    this.game.load.image("catBubble", "src/assets/catBubble.png");
    this.game.load.audio("winSound", "src/assets/sounds/winSound.wav");
    this.game.load.spritesheet(
      "mute",
      "src/assets/soundToggleSheet.png",
      96,
      96
    );
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //maxworldbounds
    this.game.world.setBounds(0, 0, 2800, 560);

    //Background
    this.background = this.game.add.tileSprite(-500, 0, 5000, 1080, "city3");
    this.background.anchor.setTo(0, 0.51);
    this.background.scale.setTo(1.5, 1.5);

    //Guy
    this.guy = this.game.add.sprite(100, 525, "guy");
    this.guy.scale.setTo(2, 2);
    this.guy.anchor.setTo(0.5, 0.5);
    this.guy.animations.add("walk", [3, 4, 3, 0]);
    this.guy.animations.add("jump", [3, 2]);
    this.guy.animations.add("crouch", [5]);
    this.game.camera.follow(this.guy);

    //immunity flag sets if guy can take damage
    this.guy.immune = false;

    //Wold Bounds
    // this.game.world.setBounds(windowWidth + guy.position.x, 0, windowWidth * 2, 560);

    //Guy Physics Elements
    this.game.physics.enable(this.guy);
    this.guy.body.gravity.y = 800;
    this.guy.body.collideWorldBounds = true;

    //Score and Timer
    this.scoreText = this.game.add.text(
      50,
      0,
      "tacos collected: " + this.score + "/10",
      this.textStyle
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
      this.textStyle
    );
    this.timerText.fixedToCamera = true;

    //boss
    this.boss = this.game.add.sprite(2800, 530, "boss");
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

    //manHoles
    this.manHoles = game.add.group();
    this.manHoles.enableBody = true;
    this.manHoles.checkWorldBounds = true;
    this.manHoles.outOfBoundsKill = true;
    this.manHoles.setAll("body.setSize", "body", 30, 30, 20, 20);
    this.makeManHole();

    //sign
    this.signs = this.game.add.physicsGroup();
    this.signs.enableBody = true;
    this.signs.checkWorldBounds = true;
    this.signs.outOfBoundsKill = true;
    this.makeSign();

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
    if (this.score <= 0) {
      this.score = 0;
      this.scoreText.text = "tacos collected: " + this.score + "/10";
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
      this.manHoles.kill();
    }

    //this.win() runs and guy walks to building

    if (this.guy.alive === false && this.score >= 0) {
      this.guy.body.velocity.x += 4;
      this.guy.scale.setTo(2, 2);
      //  You can set your own fade color and duration
      this.game.time.events.add(Phaser.Timer.SECOND * 4, this.cameraFade, this);
    }

    if (this.guy.alive === true) {
      this.isMoving = true;
      this.game.physics.arcade.collide(this.guy, this.signs);
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
        this.manHoles,
        this.collideManHole,

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
        this.manHoles.children.forEach(hole => {
          hole.body.velocity.x = 0;
        });
        this.guy.body.velocity.x = 0;
      }

      if (this.isMoving === true) {
        this.background.tilePosition.x -= 2;
        this.signs.children.forEach(Sign => {
          Sign.body.velocity.x = -175;
        });
      } else {
        this.signs.children.forEach(Sign => {
          Sign.body.velocity.x = 0;
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
      //crouch
      if (this.guy.body.blocked.down || this.guy.body.touching.down) {
        //   this.guy.animations.play("crouch", 5, true);

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
          this.guy.animations.play("crouch");
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
        this.guy.body.velocity.x -= this.speed * 3;
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
      this.score = 0;
    }
    //invoke win function on 'W' - must have enough tacos
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.W)) {
      this.win();
    }

    //delayed level restart after boss fires guy
    if (this.restart) {
      this.restart = false;
    }
    //stops boss from pushing guy after collision
    if (this.stopBoss) {
      this.boss.body.velocity.x = 0;
    }
    //sets boss position right before the end of game
    if (this.clock === 2) {
      this.boss.x = this.guy.x + 700;
    }

    //stops guy from slowly moving forward while boss fires him
    if (this.stopGuy) {
      this.guy.body.velocity.x = 0;
    }

    if (this.fired === true) {
      this.youreFired();
    }

    //MUTE-UNMUTE TOGGLE BUTTON

    let toggleMute = () => {
      if (!game.sound.mute) {
        game.sound.mute = true;
      } else {
        game.sound.mute = false;
      }
    };

    if (!game.sound.mute) {
      this.muteToggleBtn = game.add.button(
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
      this.muteToggleBtn = game.add.button(
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

  gameOver() {
    this.timer.stop();
    if (this.guy.body.position.x >= 2600) {
      game.add.tween(this.guy).to({ x: 2400 }, 1000, "Linear", true);
    }
    this.guy.alive = false;
    this.stopGuy = true;
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
    this.fired = false;
    this.stopBoss = true;
    this.boss.animations.stop(null, true);

    this.firedBubble = this.game.add.sprite(
      this.boss.body.position.x - 5,
      this.boss.body.position.y - 75,
      "firedBubble"
    );
    this.firedBubble.scale.setTo(0.7);

    //invokes restartLevel in update function
    this.game.camera.fade(0x000000, 2000);
    this.game.camera.onFadeComplete.add(this.restartLevel, this);
    // this.restart = true;
  }

  restartLevel() {
    this.restart = false;
    this.clock = 60;
    this.guy.alive = true;
    this.guy.alpha = 1;
    this.boss.visible = false;
    this.score = 0;
    this.speed = 10;
    this.guy.body.velocity.x = 1;
    this.boss.body.velocity.x = 1;
    this.stopGuy = false;
    this.stopBoss = false;

    this.game.state.restart(true, true);
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

  makeSign() {
    // this.game.debug.body(sign);
    // this.game.debug.bodyInfo(sign, 32, 32);
    let min = 1000;
    for (var i = 0; i < 6; i++) {
      const randomNumber = () => {
        const num = Math.random() * 200 + min;

        min += 1450;
        return num;
      };
      let roll = randomNumber();

      this.sign = this.signs.create(roll, 470, "sign");

      this.sign.scale.setTo(0.6, 0.6);
      this.sign.body.velocity.x = -175;
      this.sign.body.immovable = true;
      this.sign.anchor.setTo(1, 1.6);

      this.sign.body.checkCollision.right = true;
      this.sign.body.checkCollision.top = false;
      this.sign.body.checkCollision.bottom = true;
      this.sign.body.checkCollision.left = true;
    }
  }

  collideSign(guy, sign) {
    // this.game.debug.body(sign);
    // this.game.debug.bodyInfo(sign, 32, 32);

    this.isMoving = false;
    this.guy.body.velocity.x = 0;
    sign.body.velocity.x = 0;

    sign.body.enable = false;
    this.guy.body.enable = false;
  }

  makeManHole() {
    let min = 600;
    for (var i = 0; i < 10; i++) {
      const randomNumber = () => {
        // 200 is the range (plus min)
        const num = Math.random() * 350 + min;
        // min adjusts distance between manHoles
        min += 1600;
        return num;
      };
      let roll = randomNumber();

      this.manHole = this.manHoles.create(roll, 550, "manHole");

      this.manHole.scale.setTo(0.3, 0.3);
      this.manHole.anchor.setTo(0.5, 0.5);

      // setSize adjusts the size of the bounding box, or body of manHole
      // this let's 'guy' walk on top of the manHole
      this.manHole.body.setSize(25, 25, 170, 75);
      this.manHole.body.velocity.x = -175;
      this.manHole.body.checkCollision.right = false;
      this.manHole.body.checkCollision.top = false;
      this.manHole.body.checkCollision.bottom = false;
    }
  }

  collideManHole(guy, manHole) {
    // this.game.debug.body(manHole);
    // this.game.debug.bodyInfo(manHole, 32, 32);
    console.log("fell through hole");
    this.isMoving = false;
    this.guy.body.velocity.x = 0;
    manHole.body.velocity.x = 0;
    console.log(this.guy.body);
    manHole.body.enable = false;
    this.guy.body.enable = false;
    console.log("11111", this.guy.body, manHole.body);
    this.add
      .tween(this.guy.scale)
      .to({ x: 0.1, y: 7 }, 80)
      .start()
      .onComplete.add(() => this.guy.kill(), this);
    this.cameraFade();
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
      this.scoreText.text = "tacos collected: " + this.score + "/10";

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
      this.taco.body.velocity.x = -175;
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
    this.scoreText.text = "tacos collected: " + this.score + "/10";
  }

  //win screen function
  win() {
    this.winSound = this.game.add.audio("winSound");
    this.winSound.play();
    this.guy.alive = false;
    this.timer.stop();
    this.game.world.setBounds(0, 0, 2000, 560);
    //create office building at end of world
    this.office = this.game.add.image(1700, -20, "office");
    calculateGameScore.get(this.score);
    this.game.camera.fade(0x000000, 5000);
    this.game.camera.onFadeComplete.add(() => switchState(), this);
  }

  cameraFade() {
    this.game.camera.fade(0x000000, 2000);
    this.game.camera.onFadeComplete.add(this.restartLevel, this);
  }

  // render() {
  // if (showDebug)
  // {
  // this.game.debug.bodyInfo(this.guy, 32, 32);
  // this.game.debug.body(this.guy);
  // this.game.debug.body(this.manHole);
  // this.game.debug.bodyInfo(this.manHole, 32, 32);
  // }
  // }
}
