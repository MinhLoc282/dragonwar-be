

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create account
 *     tags:
 *       - User
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: formData
 *        name: userName
 *        type: string
 *        required: false
 *      - in: formData
 *        name: address
 *        type: string
 *        description: Address of wallet
 *        required: true
 *      - in: formData
 *        name: signer
 *        type: string
 *        description: Signer of wallet
 *        required: true
 *      - in: formData
 *        name: session
 *        type: string
 *        description: Session string
 *        required: true
 *      - in: formData
 *        name: avatar
 *        type: file
 *        description: Upload avatar
 *        required: false
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
 * /users:
 *   get:
 *     summary: Get users
 *     tags:
 *       - User
 *     parameters:
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: 'filter by userName or address'
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
 * /users/auth:
 *   post:
 *     summary: Login account
 *     tags:
 *       - User
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            address:
 *              type: string
 *              example: "0x9Cc0c54437c542A031eB964A1c2e20087Fc08Cd9"
 *            signer:
 *              type: string
 *              example: "0x6f2da7b92b772445383a78d31da9569a5541a137ea3381f9242ac8236ef386c06e55ed7358cc050bbb74ad582fd4abeaadb2603e2e94defdb66e9be101f4f1861c"
 *            session:
 *              type: string
 *              example: "xz2as"
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
 * /users:
 *   put:
 *     summary: Update account
 *     tags:
 *       - User
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: formData
 *        name: fullName
 *        type: string
 *        required: false
 *      - in: formData
 *        name: userName
 *        type: string
 *        required: false
 *      - in: formData
 *        name: currentPassword
 *        type: string
 *        required: false
 *      - in: formData
 *        name: newPassword
 *        type: string
 *        required: false
 *      - in: formData
 *        name: signer
 *        type: string
 *        required: false
 *      - in: formData
 *        name: session
 *        type: string
 *        required: false
 *      - in: formData
 *        name: avatar
 *        type: file
 *        description: upload avatar
 *        required: false
 *     responses:
 *       200:
 *         description: Account updated
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
 * /users/session:
 *   get:
 *     summary: Get session string
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: The profile
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: 'aqw23'
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current account
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: The profile
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
 * /users/daily-checkin:
 *   post:
 *     summary: User daily checkin
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User daily checkin
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: 'aqw23'
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: 'user id'
 *         required: true
 *     responses:
 *       200:
 *         description: User
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
 * /users/balance-fluctuations:
 *   get:
 *     summary: Get balance fluctuations
 *     tags:
 *       - User
 *     parameters:
 *       - name: status
 *         in: query
 *         type: string
 *         description: 'PENDING, SUCCESS, FAILED'
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
 *         description: Get balance fluctuations
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
