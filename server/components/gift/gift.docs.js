/**
 * @swagger
 * /gifts:
 *   get:
 *     summary: Get gift
 *     tags:
 *       - Gift
 *     responses:
 *       200:
 *         description: The gifts
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
 * /gifts/list:
 *   get:
 *     summary: Get gift for web
 *     tags:
 *       - Gift
 *     responses:
 *       200:
 *         description: The gifts
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
 * /gifts/open/{type}:
 *   post:
 *     summary: Open gift by type
 *     tags:
 *       - Gift
 *     parameters:
 *       - name: type
 *         in: path
 *         type: string
 *         description: PVE_SILVER, PVE_GOLD, DAILY_QUEST
 *         required: true
 *     responses:
 *       200:
 *         description: The teams
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
 * /gifts/open-gift/{type}:
 *   post:
 *     summary: Open gift by type for web
 *     tags:
 *       - Gift
 *     parameters:
 *       - name: type
 *         in: path
 *         type: string
 *         description: PVE_SILVER, PVE_GOLD, DAILY_QUEST
 *         required: true
 *     responses:
 *       200:
 *         description: The teams
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
