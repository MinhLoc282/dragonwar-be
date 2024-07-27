/**
 * @swagger
 * /adventures:
 *   get:
 *     summary: Get adventures
 *     tags:
 *       - Adventure
 *     parameters:
 *       - name: teamId
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The teams
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
 * /adventures/sync-boss:
 *   get:
 *     summary: Async adventure and boss
 *     tags:
 *       - Adventure
 *     responses:
 *       200:
 *         description: The teams
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
 * /adventures/{id}:
 *   get:
 *     summary: Get adventure by id (uid)
 *     tags:
 *       - Adventure
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The teams
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
 * /adventures/{id}:
 *   put:
 *     summary: Edit adventure by uid
 *     tags:
 *       - Adventure
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *      - in: body
 *        name: body
 *        description: Edit adventure
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            name:
 *              type: string
 *              example: 'Adventure 1'
 *            reward:
 *              type: number
 *              example: 1
 *            boss:
 *              type: array
 *              example: [1,1,1]
 *            position:
 *              type: array
 *              example: [1,2,3]
 *            level:
 *              type: array
 *              example: [1,1,1]
 *     responses:
 *       200:
 *         description: The team created
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *           example: {
 *              success: true,
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
