class UsersController {
  /**
   * index - GET para listar vários registros
   * show - GET para listar um registro específico
   * create - POST para criar um novo registro
   * update - PUT para atualizar um registro
   * delete - DELETE para remover um registro
   */

  create(request, response) {
    const { name, email, password } = request.body;

    return response.status(201).json({ name, email, password });
  }
};

module.exports = UsersController;