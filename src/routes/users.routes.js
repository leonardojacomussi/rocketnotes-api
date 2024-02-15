const { Router } = require("express");

const usersRouter = Router();

usersRouter.post("/", (request, response) => {
  const { name, email, password } = request.body;

  return response.json({ name, email, password });
});

module.exports = usersRouter;