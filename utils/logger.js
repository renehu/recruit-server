const wiston = require("winston");

module.exports = wiston.createLogger({
  level: "info",
  format: wiston.format.combine(
    wiston.format.timestamp(),
    wiston.format.simple()
  ),
  //defaultMeta: { service: server },
  transports: [
    new wiston.transports.File({
      filename: "./logs/error.log",
      level: "error",
      maxsize: 1024,
    }),
    new wiston.transports.File({ filename: "./logs/combined.log" }),
  ],
});

//logger.info("heloo log");
