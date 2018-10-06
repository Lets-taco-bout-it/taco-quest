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
    "DougLevel1",
    "MegLevel1",
    "MaxsLevel1",
    "MaxsLevel2"
  ];

  const index = possStates.indexOf(game.state.current);

  if (possStates.length - 1 === index) return game.state.start(possStates[0]);
  game.state.start(possStates[index + 1]);
};

export const levelData = {
  levelOne: { background: "src/assets/CityBG.png" },
  levelTwo: { background: "src/assets/cityLevel2.png" }
};
