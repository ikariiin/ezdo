import * as express from 'express';
import "reflect-metadata";
import { UserAuthRouter } from './routes/user-auth';
import { apiMiddleWare } from './middlewares/api';
import { TodoRouter } from './routes/todo';
import { GroupRouter } from './routes/group';
import { createConnection } from 'typeorm';
import { Groups } from './entities/groups';
import { User } from './entities/user';
import { Todo } from './entities/todo';
import { Command } from 'commander';
import { setDB } from './middlewares/database';

async function startApp(dbPath: string = '') {
  console.log("DB Path: ", dbPath);

  const app = express();
  app.use(express.json());
  app.use(apiMiddleWare);

  const connection = await createConnection({
    type: "sqlite",
    database: dbPath,
    entities: [
      User,
      Groups,
      Todo
    ],
    logging: true,
    synchronize: true
  });

  app.use(setDB(connection));

  app.use("/users", UserAuthRouter);
  app.use("/todo", TodoRouter);
  app.use("/groups", GroupRouter);

  app.listen(1337, () => console.log("Server started on port 1337"));
}

const program = new Command();
program
  .option("-d, --database <path>", "Path to the sqlite database");

program.parse(process.argv);

startApp(program.database);