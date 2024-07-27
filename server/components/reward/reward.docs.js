
/**
 * @swagger
 * /rewards/claim-token:
 *   post:
 *     summary: Claim token
 *     tags:
 *       - Rewards
 *     parameters:
 *      - in: body
 *        name: body
 *        description: Claim token
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            amount:
 *              type: number
 *              example: 1
 *     responses:
 *       200:
 *         description: Data
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: object
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
 * /rewards/pool-reward:
 *   get:
 *     summary: Get Pool Reward
 *     tags:
 *       - Rewards
 *     responses:
 *       200:
 *         description: Data
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: object
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

