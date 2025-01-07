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
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: O ID do usuário recém-criado
 *                   example: d8c2a7a6-4347-4e2e-8216-e4c3c26defa6
 *                 username:
 *                   type: string
 *                   description: O nome de usuário do novo usuário
 *                   example: jdoe
 *                 firstname:
 *                   type: string
 *                   description: O primeiro nome do usuário
 *                   example: John
 *                 lastname:
 *                   type: string
 *                   description: O sobrenome do usuário
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: O endereço de e-mail do usuário
 *                   example: johndoe@example.com
 *                 cpf:
 *                   type: string
 *                   description: O CPF do usuário
 *                   example: 123.456.789-00
 *                 dt_birth:
 *                   type: string
 *                   format: date
 *                   description: A data de nascimento do usuário
 *                   example: 1990-01-01T00:00:00Z
 *       400:
 *         description: This <username / cpf / email> already exists | Invalid field, <username / cpf / email> cannot be null
 *       500:
 *         description: Internal server error
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
 *                      type: string
 *                      description: O ID do usuário recém-criado
 *                      example: d8c2a7a6-4347-4e2e-8216-e4c3c26defa6
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
 *                    status:
 *                      type: boolean
 *                      description: Se o user esta ativo ou não
 *                      example: true
 *                    created_at:
 *                      type: string
 *                      format: date
 *                      description: A data de cadastro do usuário
 *                      example: 2025-01-01T00:00:00Z
 *                    updated_at:
 *                      type: string
 *                      format: date
 *                      description: A data de atualização do usuário
 *                      example: 2025-01-01T00:00:00Z
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
 *           type: string
 *           example: d8c2a7a6-4347-4e2e-8216-e4c3c26defa6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: jdoe-updated
 *               firstname:
 *                 type: string
 *                 example: John-updated
 *               lastname:
 *                 type: string
 *                 example: Doe-updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe-updated@example.com
 *               cpf:
 *                 type: string
 *                 example: 123.456.789-00
 *               dt_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01T00:00:00Z
 *               status:
 *                 type: boolean
 *                 example: true
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
 *           type: string
 *           example: d8c2a7a6-4347-4e2e-8216-e4c3c26defa6
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
