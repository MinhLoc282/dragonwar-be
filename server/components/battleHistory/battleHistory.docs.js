/**
 * @swagger
 * /battle-histories:
 *   get:
 *     summary: Get battle histories
 *     tags:
 *       - Battle Histories
 *     parameters:
 *       - name: teamId
 *         in: query
 *         type: string
 *         description: 'filter by team'
 *         required: false
 *       - name: page
 *         in: query
 *         type: number
 *         description: 'current page'
 *         required: false
 *       - name: rowPerPage
 *         in: query
 *         type: number
 *         description: 'rows per page'
 *         required: false
 *       - name: sort
 *         in: query
 *         type: number
 *         description: sort by time -1/1
 *         required: false
 *     responses:
 *       200:
 *         description: The teams
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
 *                 data: [],
 *                 "currentPage": 1,
                    "totalPage": 1,
                    "totalItems": 19
 *             }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /battle-histories/{id}:
 *   get:
 *     summary: Get battle history by id
 *     tags:
 *       - Battle Histories
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'Battle history id'
 *         required: true
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
 * /battle-histories/{id}/reward:
 *   get:
 *     summary: Get reward battle
 *     tags:
 *       - Battle Histories
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'Battle history id'
 *         required: true
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
 * /battle-histories/current-arena:
 *   get:
 *     summary: Get current arena
 *     tags:
 *       - Battle Histories
 *     responses:
 *       200:
 *         description: The teams
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
 *                 data: [],
 *                 "currentPage": 1,
                    "totalPage": 1,
                    "totalItems": 19
 *             }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
