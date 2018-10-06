import Phaser from "phaser";
import { switchState, calculateGameScore, levelData } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  windowHeight,
  windowWidth,
  guy,
  tacocat,
  cat,
  cats,
  catWalk,
  background,
  tacos,
  taco,
  scoreText,
  office,
  score = 0,
  cursors,
  speed = 4,
  //MAX VARS
  trashCans,
  trash,
  //MEG VARS
  timer,
  timerText,
  boss,
  bossWalk,
  gameOver,
  bubble,
  bubbleText,
  levelIndex = "levelOne",
  restart = false,
  isMoving;

export default class extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.clock = 60;
  }

  preload() {
    // console.log("level test", levelData.levelONE.background);
    // game.load.image("CityBG", levelData[levelIndex].background);
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    // game.load.spritesheet(
    //   "tacocat",
    //   "src/assets/tacocatspritesheet.png",
    //   336,
    //   216
    // );
    game.load.image("taco", "src/assets/taco.png");
    game.load.image("office", "src/assets/officebuilding.png");
    //cat
    game.load.spritesheet("cat", "src/assets/tacocatspritesheet.png", 336, 216);
    game.load.image("trash", "src/assets/dumpster3.png");
    game.load.image("manHole", "src/assets/manhole.png", 32, 32);
    game.load.spritesheet("boss", "src/assets/boss.png", 75, 120);
    game.load.image("bubble", "src/assets/firedBubble.png");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //maxworldbounds
    game.world.setBounds(0, 0, 2800, 560);

    //Background
    background = game.add.tileSprite(0, 0, 1920, 1080, "CityBG");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);

    //Guy
    guy = game.add.sprite(20, 525, "guy");
    guy.scale.setTo(2, 2);
    guy.anchor.setTo(0.5, 0.5);
    guy.animations.add("walk", [3, 4, 3, 0]);
    guy.animations.add("jump", [3, 2]);
    game.camera.follow(guy);
    game.physics.enable(guy, Phaser.Physics.ARCADE);
    guy.body.collideWorldBounds = true;
    guy.body.gravity.y = 800;

    trashCans = game.add.physicsGroup();
    trashCans.enableBody = true;
    trashCans.checkWorldBounds = true;
    trashCans.outOfBoundsKill = true;
    this.makeTrash();

    //immunity flag sets if guy can take damage
    guy.immune = false;

    // //Tacocat
    // this.getTacocat();

    //Wold Bounds
    // console.log(windowWidth, windowHeight);
    // game.world.setBounds(windowWidth + guy.position.x, 0, windowWidth * 2, 560);

    //Lists current game state
    game.add.text(0, 0, `${game.state.current}`);

    //Score and Timer
    scoreText = game.add.text(16, 16, "score: " + score, {
      fontSize: "32px",
      fill: "#000"
    });
    scoreText.fixedToCamera = true;

    timer = game.time.create(false);

    const updateClock = () => {
      this.clock -= 2;
      timerText.setText(`minutes remaining: ${this.clock}`);
    };

    timer.loop(1000, updateClock, this);

    timer.start();

    timerText = game.add.text(centerX, 0, `minutes remaining: ${this.clock}`, {
      font: "bold 30px Roboto Mono",
      fill: "black",
      boundsAlignH: "right",
      boundsAlignV: "top"
    });
    timerText.fixedToCamera = true;

    //boss
    boss = game.add.sprite(780, 530, "boss");
    boss.scale.setTo(0.5, 0.5);
    boss.anchor.setTo(0.5, 0.5);
    game.physics.enable(boss);
    boss.animations.add("bossWalk", [4, 5, 6, 7]);
    boss.animations.play("bossWalk", 14, true);
    boss.visible = false;

    //TRASHCANS
    // trashCans = game.add.physicsGroup();
    // trashCans.enableBody = true;
    // trashCans.checkWorldBounds = true;
    // trashCans.outOfBoundsKill = true;
    // this.makeTrash();

    //MANHOLE
    // manHole = game.add.physicsGroup();
    // manHole.enableBody = true;
    // trashCans.checkWorldBounds = true;
    // manHole.outOfBoundsKill = true;
    // manHole.anchor.setTo(0.8, 0.8);
    // this.makeManHole();

    //Tacos
    tacos = game.add.group();
    tacos.enableBody = true;
    tacos.checkWorldBounds = true;
    tacos.outOfBoundsKill = true;

    //cat
    cats = game.add.group();
    cats.enableBody = true;
    cats.checkWorldBounds = true;
    cats.outOfBoundsKill = true;

    this.makeCats();

    //  Make taco loop envoked
    this.makeTaco();
  }

  update() {
    isMoving = true;

    if (score < 1) {
      score = 0;
    }

    //KILL TIMER PLACEHOLDER if (timer === 0) {guy.alive = false}
    //when time runs out, invoke gameOver function
    this.clock <= 0 ? this.gameOver() : null;

    if (!guy.alive) {
      trashCans.kill();
      cats.kill();
      tacos.kill();
    }

    //this.win() runs and guy walks to building
    if (guy.alive === false && score >= 10) {
      guy.body.velocity.x += 4;
      guy.scale.setTo(2, 2);
      //  You can set your own fade color and duration
      game.time.events.add(Phaser.Timer.SECOND * 4, this.cameraFade, this);
    }

    if (guy.alive === true) {
      guy.animations.play("walk", 14, true);
      game.physics.arcade.collide(
        guy,
        trashCans,
        this.collideTrash,
        null,
        this
      );
      game.physics.arcade.collide(guy, cats, this.collideCat, null, this);
      game.physics.arcade.overlap(guy, tacos, this.collectTaco, null, this);

      if (isMoving === true) {
        //moving background
        background.tilePosition.x -= 2;
        trashCans.children.forEach(can => {
          can.body.velocity.x = -175;
        });
      } else {
        trashCans.children.forEach(can => {
          can.body.velocity.x = 0;
        });
      }

      // if (game.physics.arcade.collide(cats, guy))
      //TACOCAT
      // tacocat.x -= speed * 2;
      // if (tacocat.body.onFloor() === true) {
      //   tacocat.body.velocity.y = -400;
      // }
      //Set Score and win function runs
      if (score === 10) {
        this.win();
      }

      //autogenerates tacos when tacos.length is < number
      if (tacos.length < 13) {
        this.makeTaco();
      }

      // cat
      // if (cats.length < 20) {
      //   this.makeCats();
      //   // console.log(cats.length);
      // }
      // cats.x -= 10;

      //Jump
      if (
        (game.input.keyboard.isDown(Phaser.Keyboard.UP) &&
          guy.body.onFloor()) ||
        (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
          guy.body.onFloor())
      ) {
        guy.body.velocity.y = -500;
        guy.animations.stop("walk");
        guy.animations.play("jump", 14, true);
      }
      //RIGHT, LEFT MOVEMENT
      if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        // guy.scale.setTo(2, 2);
        console.log(trashCans, guy);
        guy.scale.setTo(2, 2);
        // console.log(trashCans, guy);
        guy.body.velocity.x += speed;
        // guy.body.drag = 200;
        if (guy.body.velocity.x > 150) {
          guy.body.velocity.x = 150;
        }
        // guy.animations.play("walk", 14, true);
      } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        guy.scale.setTo(-2, 2);
        guy.body.velocity.x -= speed * 2;
        if (guy.body.velocity.x < -150) {
          guy.body.velocity.x = -150;
        }
        // guy.animations.play("walk", 14, true);
      } else guy.body.velocity.x = 0;

      if (
        game.input.keyboard.isDown(Phaser.Keyboard.UP) &&
        guy.body.touching.down == true
      ) {
        guy.body.velocity.y = -400;
      }
    }
    //SWITCH STATES ON 'S'
    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      switchState();
      score = 0;
    }

    //delayed level restart after boss fires guy
    if (restart) setTimeout(this.restartLevel, 2000);
  }

  //FUNCTIONS

  gameOver() {
    timer.stop();
    guy.alive = false;
    guy.animations.stop(null, true);
    guy.tint = 0x777777;
    guy.body.velocity.x = 0;
    game.physics.arcade.collide(guy, boss, this.youreFired);

    //boss animation walking
    boss.visible = true;
    boss.body.velocity.x -= 2;
  }

  //boss fires guy text bubble
  youreFired() {
    boss.animations.stop(null, true);

    bubble = game.add.sprite(
      boss.body.position.x - 5,
      boss.body.position.y - 75,
      "bubble"
    );
    bubble.scale.setTo(0.7);

    bubbleText = game.add.text(
      bubble.x + bubble.width / 2,
      bubble.y + bubble.height / 2,
      "LATE AGAIN?! #@%! \nYOU'RE FIRED.",
      {
        font: "18px Roboto Mono",
        fill: "black",
        wordWrap: true,
        wordWrapWidth: bubble.width,
        align: "center"
      }
    );
    bubbleText.anchor.set(0.5);

    //invokes restartLevel in update function
    restart = true;
  }

  restartLevel() {
    game.state.restart(true, true);
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
      // console.log(randomNumber(), roll);
      let roll = randomNumber();

      trash = trashCans.create(roll, 470, "trash");

      trash.scale.setTo(0.7, 0.7);
      trash.body.velocity.x = -175;
      trash.body.immovable = true;
    }
  }

  makeManHole() {
    // trash locations ish
    //0-200, 650-850, 1100-1300, 1550-1750
    // let hole;
    // let min = 200;
    // for (var i = 0; i < 8; i++) {
    //   const randomNumber = () => {
    //     // 200 is the range (plus min)
    //     const num = Math.random() * 200 + min;
    //     // min adjusts distance between trash
    //     min += 450;
    //     return num;
    //   };
    //   let roll = randomNumber();
    //   hole = trashCans.create(roll, 470, "manHole");
    //   manHole.scale.setTo(0.7, 0.7);
    //   manHole.body.velocity.x = -175;
    //   manHole.body.immovable = true;
    // }
  }

  collisionHandler(obj1, obj2) {}

  makeCats() {
    for (var i = 0; i < 10; i++) {
      cat = cats.create(i * 1500, 400, "cat");
      game.physics.enable(cat);
      cat.scale.setTo(-0.2, 0.2);
      cat.anchor.setTo(0.5, 0.5);
      cat.enableBody = true;
      cat.checkWorldBounds = true;
      cat.outOfBoundsKill = true;
      // cat.events.onOutOfBounds.add(this.removeCatFromGroup);
      catWalk = cat.animations.add("catWalk", [
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
      catWalk.play(17, true);

      cat.body.gravity.y = 800;
      cat.body.collideWorldBounds = true;
      cat.body.bounce.y = 1;
      //0.9 + Math.random() * 0.2;
      cat.body.velocity.x = Math.random() * -300 - 175;
    }
  }

  collideCat(guy, cat) {
    //IF GUY COLLIDES ON TOP OF CAT
    // console.log("score", score);

    if (guy.y < cat.y) {
      cat.body.velocity.x = 0;
      cat.y -= 30;
      cat.kill();
      guy.y -= 30;
    } else {
      if (!guy.immune) {
        guy.immune = true;
        guy.alpha = 0.5;
        score -= 1;
        if (guy.body.position.x < cat.body.position.x) {
          guy.body.velocity.x = -300;
        } else {
          guy.body.velocity.x = 300;
        }
        game.time.events.add(
          500,
          () => {
            guy.immune = false;
            guy.alpha = 1;
          },
          this
        );
      }
    }

    // cat.kill();
    // this.removeCatFromGroup(cat);
    // cat.body.velocity.x = -1000;
    //FLASH GUY
    //GUY SITS
    //NOISE TRIGGERED
    //CAT SAYS 'THANKS'
  }

  // removeCatFromGroup(cat) {
  //   cats.remove(cat);
  // }

  collideTrash(guy, trash) {
    isMoving = false;
  }

  makeTaco() {
    for (var i = 0; i < 13; i++) {
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
  // move(taco) {
  //   if (taco.y === 100) {
  //     game.add
  //       .tween(taco)
  //       .to({ y: "+300" }, 2000, Phaser.Easing.Linear.None, true);
  //   } else if (taco.y === 400) {
  //     game.add
  //       .tween(taco)
  //       .to({ y: "-500" }, 2000, Phaser.Easing.Linear.None, true);
  //   }
  // }
  //collects and counts tacos, removes from group
  collectTaco(guy, taco) {
    //removes taco
    taco.kill();
    this.removeFromGroup(taco);
    //  Add and update the score
    score += 1;
    scoreText.text = "Score: " + score;
    // console.log("score", score);
  }
  //win screen function
  win() {
    guy.alive = false;
    game.world.setBounds(0, 0, 2000, 560);
    //create office building at end of world
    office = game.add.image(1700, -20, "office");
    calculateGameScore.get(timer, 10);
  }
  cameraFade() {
    game.camera.fade(0x000000, 5000);
    // switchState();
  }

  getTacocat() {
    tacocat = game.add.sprite(Math.random() * 5000, 400, "tacocat");
    tacocat.scale.setTo(-0.2, 0.2);
    tacocat.anchor.setTo(0.5, 0.5);
    catWalk = tacocat.animations.add("catWalk", [
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
    catWalk.play(17, true);

    game.physics.enable(tacocat);
    tacocat.body.gravity.y = 800;
    tacocat.body.collideWorldBounds = true;
  }
}
