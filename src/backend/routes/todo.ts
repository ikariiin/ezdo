import * as express from 'express';
import { getUsernameFromJWT } from '../util';
import { Todo } from '../entities/todo';
import { ErrorEnums } from '../error-enums';
import { Like } from 'typeorm';

const router = express.Router();

// Redeclare it here because we cannot import UI files in here which require other non-js modules
// such as scss.
enum SearchCategory {
  Task = "Task",
  Label = "Label",
  Group = "Group"
}

router.post("/create", (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  
  const { groupId, date, label, task } = req.body;
  try {
    const username = getUsernameFromJWT(jwtKey);

    const connection = req.db;
    const todos = connection.getRepository(Todo);
    
    const insertResult = todos.insert({
      dueDate: date,
      group: groupId,
      author: username,
      label,
      task
    });

    res.json({
      success: true,
      todo: insertResult
    });
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.get("/:groupId/all", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const groupId = req.params.groupId;

    const connection = req.db;
    const todos = connection.getRepository(Todo);

    res.json(
      await todos.find({
        where: { author: username, group: groupId },
        order: {
          dueDate: "ASC"
        }
      })
    );
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.put("/label/:todoId", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }
    
    const { labelStr } = req.body;
    const updateResult = await todos.update({
      id: Number(todoId)
    }, {
      label: labelStr
    });

    res.json({
      success: true,
      updateResult
    });
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.delete('/delete/:todoId', async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    const removalResult = todos.remove(specifiedTodo);
    res.json({
      success: true,
      removalResult
    });
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.get("/:todoId", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    res.json({
      success: true,
      todo: specifiedTodo
    });
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.get("/search/:category/:searchTerm", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  
  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { category, searchTerm } = req.params;

    const categoryClause: {
      task?: any,
      label?: any,
      group?: any
    } = {};
    if(category === SearchCategory.Task) { categoryClause.task = Like(`%${searchTerm}%`); }
    if(category === SearchCategory.Group) { categoryClause.group = Like(`%${searchTerm}%`); }
    if(category === SearchCategory.Label) { categoryClause.label = Like(`%${searchTerm}%`); }

    const searchResult = await todos.find({
      where: {
        author: username,
        ...categoryClause
      }
    });

    res.json({
      success: true,
      searchResult
    });
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
})

router.put("/:todoId", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    const { dueDate, task } = req.body;
    const updateResult = await todos.update({
      id: Number(todoId)
    }, {
      dueDate,
      task
    });

    res.json({
      success: true,
      updateResult
    });
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.patch("/move/:todoId", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    const { groupId } = req.body;

    const updateResult = await todos.update({
      id: Number(todoId)
    }, {
      group: Number(groupId)
    });
    res.json({
      success: true,
      updateResult
    });
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.delete("/:todoId/label/:labelIndex", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId, labelIndex } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    const newLabel = specifiedTodo.label.split("//").filter((label, index) => index !== Number(labelIndex)).join("//");
    const updateResult = await todos.update({
      id: Number(todoId)
    }, {
      label: newLabel
    });

    res.json({
      success: true,
      updateResult
    });
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.patch("/:todoId/archive", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    const updateResult = await todos.update({
      id: Number(todoId)
    }, {
      group: -1
    });

    res.json({
      success: true,
      updateResult
    });
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
})

export { router as TodoRouter };