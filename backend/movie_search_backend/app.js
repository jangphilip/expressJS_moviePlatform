const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const server = require("./routes/index.server.routes");
const logger = require("./config/winston");

const cors = require("cors");

const app = express();

app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

server(app);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  let apiError = err;

  if (!err.status && !err.statusCode) {
    apiError = createError(err);
  }

  if (process.env.NODE_ENV === "test") {
    const errObj = {
      req: {
        headers: req.headers,
        query: req.query,
        body: req.body,
        route: req.route,
      },
      error: {
        message: apiError.message,
        stack: apiError.stack,
        status: apiError.status,
        body: apiError.body,
      },
    };
    logger.error(JSON.stringify(errObj));
  } else if (process.env.NODE_ENV === "production") {
    logger.error(apiError.message);
  } else {
    if (apiError.body) {
      logger.error(apiError.message + " : " + JSON.stringify(apiError.body) + "\n" + apiError.stack);
    } else {
      logger.error(apiError.stack);
    }
  }

  res.status(apiError.status || 500).json({
    status: apiError.status || 500,
    message: apiError.status && apiError.status !== 500 ? apiError.message : "Internal Server Error",
  });
});

module.exports = app;
