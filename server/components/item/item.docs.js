
/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get items
 *     tags:
 *       - Items
 *     parameters:
 *       - name: type
 *         in: query
 *         type: string
 *         description: 'SKILL_CARD/EXP_CARD/EQUIPMENT'
 *         required: false
 *       - name: nftType
 *         in: query
 *         description: id type nft
 *         type: string
 *         required: false
 *       - name: part
 *         in: query
 *         type: string
 *         required: false
 *       - name: exceptId
 *         in: query
 *         type: number
 *         required: false
 *       - name: exp
 *         in: query
 *         type: string
 *         required: false
 *       - name: rarity
 *         in: query
 *         type: string
 *         required: false
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: 'search nft'
 *         required: false
 *       - name: owner
 *         in: query
 *         type: string
 *         description: 'address of owner'
 *         required: false
 *       - name: status
 *         in: query
 *         type: string
 *         description: 'ACTIVE/SELLING/USED/BURNED'
 *         required: false
 *       - name: price
 *         in: query
 *         type: string
 *         description: from,to
 *         required: false
 *       - name: price
 *         in: query
 *         type: string
 *         description: from,to
 *         required: false
 *       - name: level
 *         in: query
 *         type: string
 *         description: from,to
 *         required: false
 *       - name: order
 *         in: query
 *         type: string
 *         enum: [ "id", "price", "dateListed" ]
 *         description: 'order dragons'
 *         required: false
 *       - name: orderBy
 *         in: query
 *         type: string
 *         enum: [ "asc", "desc"]
 *         description: 'orderBy dragons: asc, desc'
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
 *         description: The items
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
 * /items/equipments:
 *   get:
 *     summary: Get equipments
 *     tags:
 *       - Items
 *     parameters:
 *       - name: part
 *         in: query
 *         type: string
 *         required: false
 *       - name: rarity
 *         in: query
 *         type: string
 *         required: false
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: 'search nft'
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
 *         description: The items
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
 * /items/{type}/{id}:
 *   get:
 *     summary: Get item
 *     tags:
 *       - Items
 *     parameters:
 *       - name: type
 *         in: path
 *         type: string
 *         description: 'SKILL_CARD/EXP_CARD/EQUIPMENT'
 *         required: true
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'nftId'
 *         required: true
 *     responses:
 *       200:
 *         description: The item
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
 * /items/histories/{type}/{id}:
 *   get:
 *     summary: Get item histories
 *     tags:
 *       - Items
 *     parameters:
 *       - name: type
 *         in: path
 *         type: string
 *         description: 'SKILL_CARD/EXP_CARD/EQUIPMENT'
 *         required: true
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'nftId'
 *         required: true
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
 *         description: The item histories
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
 * /items/migrate/{type}/{id}:
 *   get:
 *     summary: Get migrate item
 *     tags:
 *       - Items
 *     parameters:
 *       - name: type
 *         in: path
 *         type: string
 *         description: 'SKILL_CARD/EXP_CARD/EQUIPMENT'
 *         required: true
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'nftId'
 *         required: true
 *     responses:
 *       200:
 *         description: The item histories
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /items/upgrade-success-rate:
 *   get:
 *     summary: Get upgrade success rate
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Get upgrade success rate
 *         schema:
 *           type: object
 *           example: {
 *             success: true
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /items/sync-equipments:
 *   post:
 *     summary: Sync equipment
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Sync equipment
 *         schema:
 *           type: object
 *           example: {
 *             success: true
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
