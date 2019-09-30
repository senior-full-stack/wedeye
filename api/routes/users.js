const express = require("express"),
  usersRouter = new express.Router(),
  usersCtrl = require("../controllers/users.js");

usersRouter.post("/", usersCtrl.create);

usersRouter.post("/auth", usersCtrl.authenticate);

usersRouter.post("/search/:page", usersCtrl.search);

usersRouter.get("", usersCtrl.checkEmailNotTaken);

usersRouter.get("/all", usersCtrl.allUsers);

usersRouter.post("/all", usersCtrl.editUsers);

usersRouter
  .route("/:id")
  .get(usersCtrl.show)
  .patch(usersCtrl.update)
  .delete(usersCtrl.destroy);

module.exports = usersRouter;
