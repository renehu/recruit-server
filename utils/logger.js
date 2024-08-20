const winston = require("winston");
const path = require("path");
const fs = require("fs");

// 定义日志目录路径
const logDir = path.join(__dirname, "../logs");

// 如果不是生产环境，确保日志目录存在
if (process.env.NODE_ENV !== "production" && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    // use console log in all env
    new winston.transports.Console(),
    // use file log only in NOT prod env
    ...(process.env.NODE_ENV !== "production"
      ? [
          new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
            maxsize: 1024,
          }),
          new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
          }),
        ]
      : []),
  ],
});

//logger.info("heloo log");

module.exports = logger;
