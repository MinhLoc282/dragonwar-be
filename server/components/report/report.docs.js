/**
 * @swagger
 * /reports:
 *   get:
 *     summary: get report
 *     tags:
 *       - Report
 *     parameters:
 *       - name: type
 *         in: query
 *         type: string
 *         enum: [ "level", "generation", "potential", "cooldownIndex", "xp", "totalStats.total", "totalStats.mana", "totalStats.speed", "totalStats.morale", "totalStats.attack", "totalStats.health", "totalStats.defend"]
 *         description: 'order dragons'
 *         required: false
 *     responses:
 *       200:
 *         description: favorites dragon
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
 *                 data: [
 *                     {
                          "totalStats": {
                            "mana": 40,
                            "health": 40,
                            "attack": 39,
                            "defend": 36,
                            "speed": 37,
                            "morale": 36,
                            "total": 228
                          },
                          "cooldownIndex": 4,
                          "potential": 4,
                          "id": 984,
                          "generation": 0,
                          "level": 8,
                          "xp": 2800
                        }
 *                 ]
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
 * /reports/chart:
 *   get:
 *     summary: get chart
 *     tags:
 *       - Report
 *     responses:
 *       200:
 *         description: favorites dragon
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
 *                 data: [
 *                     {
                          "dragons": 3680,
                          "breeding": 740,
                          "adventure": 4840,
                          "boots": 12,
                          "date": "2021-10-04T17:00:00.000Z",
                          "_id": "615c2dbc24899b21561e857e"
                      },
                      {
                          "dragons": 3671,
                          "breeding": 731,
                          "adventure": 4697,
                          "boots": 12,
                          "date": "2021-10-04T17:00:00.000Z",
                          "_id": "615c2dd824899b21561e93d9"
                      }
 *                 ]
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
 * /reports/report-marketplace-items:
 *   get:
 *     summary: get report items
 *     tags:
 *       - Report
 *     parameters:
 *       - name: itemType
 *         in: query
 *         type: string
 *         enum: [ "EQUIPMENT", "SKILL_CARD", "EXP_CARD"]
 *         required: false
 *       - name: type
 *         in: query
 *         type: string
 *         enum: [ "SELLING", "SOLD", "BURNED"]
 *         required: false
 *     responses:
 *       200:
 *         description: favorites dragon
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
 * /reports/count-marketplace-items:
 *   get:
 *     summary: count marketplace items
 *     tags:
 *       - Report
 *     responses:
 *       200:
 *         description: favorites dragon
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
 * /reports/admin/battles:
 *   get:
 *     summary: get battle reports
 *     tags:
 *       - Report
 *     responses:
 *       200:
 *         description: favorites dragon
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
