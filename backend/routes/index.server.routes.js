const search = require("./search/controller/index");

const router = (app) => {
  app.use("/api/search", search);
};

module.exports = router;