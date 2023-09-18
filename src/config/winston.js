// for logging the application logs (error, info, all)
import winston, { format } from 'winston';

// file options for the winston logger module
var options = {
    allfile: {
        level: 'silly',
        filename: './logs/app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        colorize: false,
      },
    errorfile: {
      level: 'error',
      filename: './logs/error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 50,
      colorize: false,
    },
    combinedfile: {
        level: 'info',
        filename: './logs/app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };
  
  // creating the logger instance with options
  var logger = winston.createLogger({
    format: format.combine(
      format.splat(),
      format.simple()
    ),
    transports: [
      new winston.transports.File(options.allfile),
      new winston.transports.File(options.errorfile),
      new winston.transports.File(options.combinedfile),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  // creating logger stream to attach with morgan logger so that morgan logging data can be stored in log files
  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  //
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.argv.indexOf("--prod") === -1) {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
}

export default logger;