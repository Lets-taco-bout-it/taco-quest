export const centerGameObjects = objects => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};
export const switchState = () => {
  const possStates = [
    "Boot",
    "intro",
    "LevelONE",
    "HighScore",
    "LevelTWO",

    // "DougLevel1",
    // "MegLevel1",
    // "MaxsLevel1",
    "HighScore2"
  ];

  const index = possStates.indexOf(game.state.current);

  if (possStates.length - 1 === index) return game.state.start(possStates[0]);
  game.state.start(possStates[index + 1]);
};

export const calculateGameScore = {
  score: 0,
  get: function(score) {
    this.score = score;
    console.log(this.score, "XXXXXXXXXX");

    return this.score;
  }
};
