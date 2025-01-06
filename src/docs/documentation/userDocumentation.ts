/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operações relacionadas aos usuários
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Endpoint para criar um usuário com base nas informações fornecidas.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: O nome de usuário do novo usuário
 *                 example: jdoe
 *               firstname:
 *                 type: string
 *                 description: O primeiro nome do usuário
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: O sobrenome do usuário
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: O endereço de e-mail do usuário
 *                 example: johndoe@example.com
 *               cpf:
 *                 type: string
 *                 description: O CPF do usuário
 *                 example: 123.456.789-00
 *               password:
 *                 type: string
 *                 description: A senha do usuário
 *                 example: 123456
 *               dt_birth:
 *                 type: string
 *                 format: date
 *                 description: A data de nascimento do usuário
 *                 example: 1990-01-01T00:00:00Z
*/

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                    id:
 *                      type: integer
 *                      description: O ID do usuário recém-criado
 *                      example: 1
 *                    username:
 *                      type: string
 *                      description: O nome de usuário do novo usuário
 *                      example: jdoe
 *                    firstname:
 *                      type: string
 *                      description: O primeiro nome do usuário
 *                      example: John
 *                    lastname:
 *                      type: string
 *                      description: O sobrenome do usuário
 *                      example: Doe
 *                    email:
 *                      type: string
 *                      format: email
 *                      description: O endereço de e-mail do usuário
 *                      example: johndoe@example.com
 *                    cpf:
 *                      type: string
 *                      description: O CPF do usuário
 *                      example: 123.456.789-00
 *                    dt_birth:
 *                      type: string
 *                      format: date
 *                      description: A data de nascimento do usuário
 *                      example: 1990-01-01T00:00:00Z
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos para atualização
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deleta um usuário existente
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O ID do usuário a ser deletado
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
