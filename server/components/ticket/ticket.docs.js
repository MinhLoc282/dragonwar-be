
/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get tickets
 *     tags:
 *       - Tickets
 *     parameters:
 *       - name: team
 *         in: query
 *         type: string
 *         description: '_id team'
 *         required: false
 *       - name: txHash
 *         in: query
 *         type: string
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
