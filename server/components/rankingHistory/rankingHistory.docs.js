
/**
 * @swagger
 * /ranking-histories:
 *   get:
 *     summary: Get ranking histories
 *     tags:
 *       - Ranking History
 *     parameters:
 *       - name: type
 *         in: query
 *         type: string
 *         description: ADVENTURE/ARENA
 *       - name: isOwner
 *         in: query
 *         type: boolean
 *       - name: month
 *         in: query
 *         type: number
 *       - name: year
 *         in: query
 *         type: number
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
 *     responses:
 *       200:
 *         description: List users
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
 * /ranking-histories/overview:
 *   get:
 *     summary: Get overview ranking histories
 *     tags:
 *       - Ranking History
 *     parameters:
 *       - name: type
 *         in: query
 *         type: string
 *         description: ADVENTURE/ARENA
 *     responses:
 *       200:
 *         description: List users
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
