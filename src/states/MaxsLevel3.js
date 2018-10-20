import Phaser from "phaser";
import { switchState, calculateGameScore } from "../utils";

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
  cursors,
  speed = 10,
  //MAX VARS
  manHole,
  manHoles,
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
  restart = false,
  isMoving = true;

export default class extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.clock = 60;
    this.score = 0;
    this.falling = false;
  }

  preload() {
    game.load.image("city3", "src/assets/cityLevel3.png", 995, 490);
    game.load.spritesheet("guy", "src/assets/guy_sheet.png", 32, 32);
    // game.load.spritesheet(
    //   "tacocat",
    //   "src/assets/tacocatspritesheet.png",
    //   336,
    //   216
    // );
    game.load.image("taco", "src/assets/taco.png");
    game.load.image("office", "src/assets/officebuilding.png");
    game.load.image("manHole", "src/assets/manhole.png", 387, 130);
    //cat
    game.load.spritesheet("cat", "src/assets/tacocatspritesheet.png", 336, 216);
    game.load.image("trash", "src/assets/dumpster3.png");
    game.load.spritesheet("boss", "src/assets/boss.png", 75, 120);
    game.load.image("bubble", "src/assets/firedBubble.png");
    game.load.image("catBubble", "src/assets/catBubble.png");
  }

  create() {
    // physics.add.collider(groundLayer, player);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //maxworldbounds
    game.world.setBounds(0, 0, 2800, 575);

    //Background
    background = game.add.tileSprite(-500, 0, 5000, 1080, "city3");
    background.anchor.setTo(0, 0.51);
    background.scale.setTo(1.5, 1.5);

    //Guy
    guy = game.add.sprite(100, 535, "guy");
    guy.scale.setTo(2, 2);
    guy.anchor.setTo(0.5, 0.5);
    guy.animations.add("walk", [3, 4, 3, 0]);
    guy.animations.add("jump", [3, 2]);
    guy.animations.add("crouch", [22, 3]);
    game.camera.follow(guy);

    //immunity flag sets if guy can take damage
    guy.immune = false;

    // //Tacocat
    // this.getTacocat();

    //Wold Bounds
    // game.world.setBounds(windowWidth + guy.position.x, 0, windowWidth * 2, 560);

    //Guy Physics Elements
    game.physics.enable(guy);
    guy.body.gravity.y = 800;
    guy.body.collideWorldBounds = true;

    //Lists current game state
    game.add.text(0, 0, `${game.state.current}`);

    //Score and Timer
    scoreText = game.add.text(16, 16, "tacos collected: " + this.score, {
      fontSize: "32px",
      //change font color here???
      //   fontColor: "white",
      fill: "#ffffff"
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
      fill: "#ffffff",
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
    trashCans = game.add.physicsGroup();
    trashCans.enableBody = true;
    trashCans.checkWorldBounds = true;
    trashCans.outOfBoundsKill = true;
    this.makeTrash();

    //manhole
    manHoles = game.add.physicsGroup();
    manHoles.enableBody = true;
    manHoles.checkWorldBounds = true;
    manHoles.outOfBoundsKill = true;
    manHoles.setAll("body.setSize", "body", 20, 30, 20, 20);
    this.makeManHole();

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
    if (this.score <= 0) {
      this.score = 0;
      scoreText.text = "tacos collected: " + this.score;
    }

    //KILL TIMER PLACEHOLDER if (timer === 0) {guy.alive = false}
    //when time runs out, invoke gameOver function
    if (this.clock <= 0 && this.score < 10) {
      this.gameOver();
    }

    if (!guy.alive) {
      trashCans.kill();
      cats.kill();
      tacos.kill();
      manHoles.kill();
    }

    //this.win() runs and guy walks to building
    if (guy.alive === false && this.score >= 10) {
      guy.body.velocity.x += 4;
      guy.scale.setTo(2, 2);
      //  You can set your own fade color and duration
      game.time.events.add(Phaser.Timer.SECOND * 4, this.cameraFade, this);
    }

    if (guy.alive === true) {
      game.physics.arcade.collide(
        guy,
        trashCans,
        this.collideTrash,
        null,
        this
      );

      {
        game.physics.arcade.collide(guy, manHole, gameOver, null, this);
        game.physics.arcade.collide(guy, cats, this.collideCat, null, this);
        game.physics.arcade.overlap(guy, tacos, this.collectTaco, null, this);
        game.physics.arcade.overlap(
          guy,
          manHoles,
          this.collideManHole,
          null,
          this
        );

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
          manHoles.children.forEach(hole => {
            hole.body.velocity.x = 0;
          });
          guy.body.velocity.x = 0;
        }

        // if (game.physics.arcade.collide(cats, guy))
        //TACOCAT
        // tacocat.x -= speed * 2;
        // if (tacocat.body.onFloor() === true) {
        //   tacocat.body.velocity.y = -400;
        // }
        //Set Score and win function runs
        if (this.clock <= 0 && this.score >= 10) {
          this.win();
        }

        //autogenerates tacos when tacos.length is < number
        if (tacos.length < 10) {
          this.makeTaco();
        }

        // cat boundaries
        cats.children.map(cat => {
          if (cat.body.position.x <= 20) {
            this.removeCatFromGroup(cat);
            cat.kill();
          }
        });

        //regenerates cats
        if (cats.length < 8) {
          this.makeCats();
        }

        //cat speed
        cats.x -= 5;

        //crouch NOT LIKING THIS AT ALL!
        //   if (guy.body.blocked.down) {
        //     guy.animatins.stop("duck", 2, true);
        //   }

        //Jump/duck
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN));
        else if (guy.body.blocked.down || guy.body.touching.down) {
          guy.animations.play("walk", 14, true);

          if (
            game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
            game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
          ) {
            guy.animations.stop("walk");
            guy.animations.play("jump");
            guy.animations.play("duck");
            guy.body.velocity.y = -500;
          }
        }
        //RIGHT, LEFT MOVEMENT
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
          guy.scale.setTo(2, 2);
          guy.body.velocity.x += speed;
          if (guy.body.velocity.x > 150) {
            guy.body.velocity.x = 150;
          }
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
          guy.scale.setTo(-2, 2);
          guy.body.velocity.x -= speed * 2;
          if (guy.body.velocity.x < -150) {
            guy.body.velocity.x = -150;
          }
        } else {
          guy.body.velocity.x = 0;
          // guy.animations.stop("jump");
          // guy.animations.play("walk", 14, true);
        }
      }
      //SWITCH STATES ON 'S'
      if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
        switchState();
        this.score = 0;
      }

      //delayed level restart after boss fires guy
      if (restart) setTimeout(this.restartLevel, 2000);
    }
    if (guy.y > game.height || guy.y < 0) {
      gameOver();
    }
  }

  //FUNCTIONS

  //   playerDuck() {
  //     if (guy.body.touching.down && !guy._inDuck) {
  //       guy._verticalPosition = guy.y;
  //       guy._normalHeight = guy.height;
  //       guy._inDuck = true;
  //       guy.body.height = 0.75 * guy._normalHeight;
  //       guy.y = guy.y + guy._normalHeight - guy.body.height;
  //       guy.frame = 5;
  //     }
  //   }

  //   guyUp() {
  //     if (guy.body.touching.down && guy._inDuck) {
  //       guy._inDuck = false;
  //       guy.body.height = guy._normalHeight;
  //       guy.y = guy._verticalPosition;
  //       guy.frame = 22;
  //     }
  //   }

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

    //invokes restartLevel in update function
    restart = true;
  }

  //   restartLevel() {

  //   }

  makeTrash() {
    let min = 1000;
    for (var i = 0; i < 10; i++) {
      const randomNumber = () => {
        // 200 is the range (plus min)
        const num = Math.random() * 200 + min;
        // min adjusts distance between trash
        min += 1450;
        return num;
      };
      let roll = randomNumber();

      trash = trashCans.create(roll, 470, "trash");

      trash.scale.setTo(0.7, 0.7);
      trash.anchor.setTo(-0.2, -0.2);
      trash.body.velocity.x = -175;
      trash.body.immovable = true;
    }
  }

  makeManHole() {
    let min = 600;
    for (var i = 0; i < 15; i++) {
      const randomNumber = () => {
        // 200 is the range (plus min)
        const num = Math.random() * 350 + min;
        // min adjusts distance between manHoles
        min += 1600;
        return num;
      };
      let roll = randomNumber();

      manHole = manHoles.create(roll, 550, "manHole");

      manHole.scale.setTo(0.3, 0.3);
      manHole.anchor.setTo(0.3, 0.3);

      manHole.body.velocity.x = -175;
      manHole.body.immovable = true;
    }
  }

  collideManHole() {
    console.log("fell through hole");
    isMoving = false;
    this.add
      .tween(guy.scale)
      .to({ x: 0.3, y: 10 }, 500)
      .start()

      .onComplete.add(() => guy.destroy(), this);
    if (this.clock <= 0 && this.score < 10) {
      this.gameOver();
    }

    // this.falling = true;
  }

  //   manHoleTween(){
  //       .tween(guy.)
  //       .to({x:.3, y:})
  //   }

  makeCats() {
    let min = 700;
    for (var i = 0; i < 8; i++) {
      const randomNum = () => {
        const num = Math.random() * 200 + min;
        min += 1450;
        return num;
      };

      let roll = randomNum();

      cat = cats.create(roll, 800, "cat");
      game.physics.enable(cat);
      cat.scale.setTo(-0.2, 0.2);
      cat.anchor.setTo(0.5, 0.5);
      cat.enableBody = true;
      cat.checkWorldBounds = true;
      cat.outOfBoundsKill = true;
      cat.events.onOutOfBounds.add(this.removeCatFromGroup);
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
      scoreText.text = "tacos collected: " + this.score;

      //adds cat speech bubble
      cat.x = cat.x;
      bubble = game.add.sprite(
        cat.body.position.x - 5,
        cat.body.position.y - 75,
        "catBubble"
      );
      bubble.scale.setTo(0.7);

      //sets timer for immunity and cat bubble
      game.time.events.add(
        700,
        () => {
          guy.immune = false;
          guy.alpha = 1;
          bubble.alpha = 0;
        },
        this
      );
    }

    // cat.kill();
    // this.removeCatFromGroup(cat);
    // cat.body.velocity.x = -1000;
    //FLASH GUY
    //GUY SITS
    //NOISE TRIGGERED
    //CAT SAYS 'THANKS'
  }

  removeCatFromGroup(cat) {
    cats.remove(cat);
  }

  collideTrash(guy, trash) {
    // isMoving = false;
  }

  makeTaco() {
    for (var i = 0; i < 15; i++) {
      taco = tacos.create(Math.random() * 5000, -5, "taco");
      //for fixed position remove move() and set to i * 70, Math.random() * 200, 'taco'
      taco.scale.setTo(0.05, 0.05);
      taco.checkWorldBounds = true;
      taco.outOfBoundsKill = true;
      taco.events.onOutOfBounds.add(this.removeFromGroup);

      //  Optional taco gravity
      taco.body.gravity.y = Math.random() * 300;
      // taco.body.gravity.x = Math.random() * -300;
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
    this.score += 1;
    scoreText.text = "tacos collected: " + this.score;
  }
  //win screen function
  win() {
    guy.alive = false;
    timer.stop();
    game.world.setBounds(0, 0, 2000, 560);
    //create office building at end of world
    office = game.add.image(1700, -20, "office");
    calculateGameScore.get(timer, 10);
  }
  cameraFade() {
    game.camera.fade(0x000000, 5000);
    // switchState();
  }

  // render() {
  //   // if (showDebug)
  //   // {
  //   game.debug.bodyInfo(guy, 32, 32);
  //   game.debug.body(guy);
  //   // }
  // }

  // getTacocat() {
  //   tacocat = game.add.sprite(Math.random() * 5000, 400, "tacocat");
  //   tacocat.scale.setTo(-0.2, 0.2);
  //   tacocat.anchor.setTo(0.5, 0.5);
  //   catWalk = tacocat.animations.add("catWalk", [
  //     0,
  //     1,
  //     2,
  //     3,
  //     4,
  //     5,
  //     6,
  //     7,
  //     8,
  //     9,
  //     10,
  //     11,
  //     12,
  //     13,
  //     14,
  //     15,
  //     16,
  //     17
  //   ]);
  //   catWalk.play(17, true);

  //   game.physics.enable(tacocat);
  //   tacocat.body.gravity.y = 800;
  //   tacocat.body.collideWorldBounds = true;
  // }
}
