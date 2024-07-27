
/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get teams
 *     tags:
 *       - Team
 *     parameters:
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: 'filter by name'
 *         required: false
 *       - name: owner
 *         in: query
 *         type: string
 *         description: '_id of owner'
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

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create team
 *     tags:
 *       - Team
 *     parameters:
 *      - in: body
 *        name: body
 *        description: Create team
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            name:
 *              type: string
 *              example: 'Team 1'
 *            dragons:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                    example: 1
 *                  position:
 *                    type: number
 *                    example: 1
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
 * /teams/{id}:
 *   put:
 *     summary: Update team
 *     tags:
 *       - Team
 *     parameters:
 *      - name: id
 *        in: path
 *        description: team id
 *        required: true
 *      - in: body
 *        name: body
 *        description: Create team
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            name:
 *              type: string
 *              example: 'Team 1'
 *            dragons:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                    example: 1
 *                  position:
 *                    type: number
 *                    example: 1
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
 *              payload: true
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
 * /teams/{id}:
 *   get:
 *     summary: Get team
 *     tags:
 *       - Team
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'team id'
 *         required: true
 *     responses:
 *       200:
 *         description: The team
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
 * /teams/{id}:
 *   delete:
 *     summary: Delete team
 *     tags:
 *       - Team
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'team id'
 *         required: true
 *     responses:
 *       200:
 *         description: The team
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: true
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */


/**
 * @swagger
 * /teams/ranking:
 *   get:
 *     summary: Get ranks
 *     tags:
 *       - Team
 *     parameters:
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: 'filter by name'
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
 *       - name: isOwner
 *         in: query
 *         type: boolean
 *         required: false
 *       - name: type
 *         in: query
 *         type: string
 *         required: false
 *         description: Type ranking pvp/pve, default pvp
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
