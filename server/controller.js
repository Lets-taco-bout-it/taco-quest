module.exports = {
  getLvl1: (req, res) => {
    const dbInstance = req.app.get("db");

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
  }
};
