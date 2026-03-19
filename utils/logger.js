import fs from "fs";
import path from "path";

// log file paths
const appLogPath = path.join("logs", "app.log");
const errorLogPath = path.join("logs", "error.log");

// ============================
// REQUEST LOGGER (ALL REQUESTS)
// ============================
export const requestLogger = (req, res, next) => {
    const log = `
[${new Date().toISOString()}]
METHOD: ${req.method}
URL: ${req.originalUrl}
IP: ${req.ip}
----------------------------------
`;
    fs.appendFileSync(appLogPath, log);
    next();
};

// ============================
// ERROR LOGGER (500 ERRORS)
// ============================
export const errorLogger = (err, req, res, next) => {
    const log = `
[${new Date().toISOString()}]
METHOD: ${req.method}
URL: ${req.originalUrl}
ERROR: ${err.message}
STACK: ${err.stack}
----------------------------------
`;
    fs.appendFileSync(errorLogPath, log);
    // res.status(500).send("Internal Server Error");
    next(err);
};
