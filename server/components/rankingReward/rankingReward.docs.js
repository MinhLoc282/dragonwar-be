/**
 * @swagger
 * /ranking-rewards:
 *   get:
 *     summary: Get reward battle
 *     tags:
 *       - Ranking Rewards
 *     responses:
 *       200:
 *         description: The detail battle
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {}
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /ranking-rewards:
 *   post:
 *     summary: Create ranking reward
 *     tags:
 *       - Ranking Rewards
 *     parameters:
 *      - in: body
 *        name: body
 *        description: Create ranking reward
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            from:
 *              type: number
 *              example: 1
 *            to:
 *              type: number
 *              example: 20
 *            reward:
 *              type: number
 *              example: 1
 *     responses:
 *       200:
 *         description: The team created
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: object
 *               properties:
 *                 $ref: '#/definitions/team'
 *           example: {
 *              success: true,
 *              payload: {}
 *           }
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: string
 *           example: Unauthorized
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */


/**
 * @swagger
 * /ranking-rewards/{id}:
 *   get:
 *     summary: Get ranking reward by id
 *     tags:
 *       - Ranking Rewards
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: []
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /ranking-rewards/{id}:
 *   put:
 *     summary: Edit ranking reward by id
 *     tags:
 *       - Ranking Rewards
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: []
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /ranking-rewards/{id}:
 *   delete:
 *     summary: Delete ranking reward by id
 *     tags:
 *       - Ranking Rewards
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: []
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
