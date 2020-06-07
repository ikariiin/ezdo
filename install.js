const sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dbPath = path.join(__dirname, "ezdo.sqlite");;

// Crate the database file
const database = new sqlite3.Database(dbPath);
database.close();

const envConfig = {
  DATABASE: dbPath
};

// Get a port form the user
rl.question("Port to listen to in the HTTP server(8080): ", (port) => {
  if(port.trim().length === 0) {
    envConfig.HTTP_PORT = 8080;
  } else {
    envConfig.HTTP_PORT = Number(port);
  }
  
  rl.question("App deploy mode [P]roduction/[D]evelopment (development by default): ", (mode) => {
    if(mode.toLocaleLowerCase() === 'p') {
      envConfig.APP_MODE = "production";
    } else if(mode.toLocaleLowerCase() === 'd') {
      envConfig.APP_MODE = "development";
    } else {
      console.log("Could not identify mode, defaulting to development.");
      envConfig.APP_MODE = "development";
    }

    const imageDir = path.join(__dirname, "ezdo_static-image-store");
    rl.question(`Image store directory(${imageDir}): `, (storeDir) => {
      if(storeDir.trim().length === 0) {
        envConfig.IMAGE_STORE_FS = imageDir;
        if(!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);
      } else {
        envConfig.IMAGE_STORE_FS = storeDir;
      }

      const logFile = path.join(__dirname, "logs/ezdo.log");
      rl.question(`Path to log file(${logFile}): `, (file) => {
        if(file.trim().length === 0) {
          envConfig.LOG_FILE = logFile;
          if(!fs.existsSync(path.join(__dirname, "logs"))) fs.mkdirSync(path.join(__dirname, "logs"));
        } else {
          envConfig.LOG_FILE = file;
        }
        fs.closeSync(fs.openSync(envConfig.LOG_FILE, 'w'));

        rl.close();
      });
    });
  })
});

rl.on('close', () => {
  const env = Object.keys(envConfig).map(key => `${key}="${envConfig[key]}"`).join('\n');
  console.log(env);
  
  fs.writeFile(path.join(__dirname, ".env"), env, () => {
    console.log("Setup complete. You can now start the server by using `npm start`.");
  });
});