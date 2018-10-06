module.exports = {
  getLvl1: (req, res) => {
    const dbInstance = req.app.get("db");
    console.log("GETLVL1");

    dbInstance
      .get_lvl1()
      .then(post => res.status(200).send(post))
      .catch(err => {
        res.status(500).send({ errorMessage: "get request error!" });
        console.log(err);
      });
  },
  getLvl2: (req, res) => {
    const dbInstance = req.app.get("db");

    dbInstance
      .get_lvl2()
      .then(post => res.status(200).send(post))
      .catch(err => {
        res.status(500).send({ errorMessage: "get request error!" });
        console.log(err);
      });
  },
  getLvl3: (req, res) => {
    const dbInstance = req.app.get("db");

    dbInstance
      .get_lvl3()
      .then(post => res.status(200).send(post))
      .catch(err => {
        res.status(500).send({ errorMessage: "get request error!" });
        console.log(err);
      });
  },
  postLvl1: (req, res) => {
    const dbInstance = req.app.get("db");
    const { initials, score } = req.body;

    dbInstance
      .post_lvl1([initials, score])
      .then(() => res.sendStatus(200, "All good!"))
      .catch(err => {
        res.status(500).send({ errorMessage: "Server Error!" });
        console.log(err);
      });
  },
  postLvl2: (req, res) => {
    const dbInstance = req.app.get("db");
    const { initials, score } = req.body;

    dbInstance
      .post_lvl2([initials, score])
      .then(() => res.sendStatus(200, "All good!"))
      .catch(err => {
        res.status(500).send({ errorMessage: "Server Error!" });
        console.log(err);
      });
  },
  postLvl3: (req, res) => {
    const dbInstance = req.app.get("db");
    const { initials, score } = req.body;

    dbInstance
      .post_lvl3([initials, score])
      .then(() => res.sendStatus(200, "All good!"))
      .catch(err => {
        res.status(500).send({ errorMessage: "Server Error!" });
        console.log(err);
      });
  }
};
