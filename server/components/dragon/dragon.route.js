import { Router } from 'express';
import * as DragonController from './dragon.controller';
import { isAuthorized } from '../../api/auth.middleware';
import { migrateDataDragons } from './dragon.service';

const router = new Router();

router.route('')
  .get(
    isAuthorized(),
    DragonController.getDragons,
  );
router.route('/migrate-data')
  .get(
    isAuthorized(true),
    DragonController.migrateData,
  );
router.route('/migrate-data-db')
  .get(
    isAuthorized(true),
    DragonController.migrateDataDB,
  );
router.route('/update-redis')
  .get(
    isAuthorized(true),
    DragonController.updateRedis,
  );
router.route('/check-hash')
  .get(
    isAuthorized(),
    DragonController.checkHash,
  );
router.route('/upload-ipfs')
  .post(
    DragonController.uploadIPFS,
  );
router.route('/get-cooldowns')
  .get(
    DragonController.getCooldowns,
  );
router.route('/get-birthCost')
  .get(
    DragonController.getBirthCost,
  );
router.route('/get-parts')
  .get(
    DragonController.getParts,
  );

/**
 * @swagger
 * /dragons/skills:
 *   get:
 *     summary: Get dragon skills
 *     tags:
 *       - Dragon
 *     parameters:
 *       - name: part
 *         in: query
 *         type: string
 *         required: false
 *         description: class,class,class
 *       - name: rarity
 *         in: query
 *         type: string
 *         required: false
 *       - name: textSearch
 *         in: query
 *         type: string
 *         required: false
 *       - name: attack
 *         in: query
 *         type: string
 *         required: false
 *         description: from,to
 *       - name: defend
 *         in: query
 *         type: string
 *         required: false
 *         description: from,to
 *       - name: order
 *         in: query
 *         type: string
 *         enum: ["attack", "defend"]
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
 *         description: The skills
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
router.route('/skills')
  .get(
    DragonController.getListDragonSkills
  );

/**
 * @swagger
 * /dragons/detail-effects:
 *   get:
 *     summary: Get effect
 *     tags:
 *       - Dragon
 *     responses:
 *       200:
 *         description: The effect
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
router.route('/detail-effects')
  .get(
    DragonController.getListEffect
  );
router.route('/sync-dragon')
  .get(
    DragonController.syncDragon,
  );
router.route('/get-dragon-adventure')
  .get(
    isAuthorized(true),
    DragonController.getDragonAdventure,
  );
router.route('/notifications')
  .get(
    isAuthorized(true),
    DragonController.getNotifications,
  );
router.route('/total-notifications')
  .get(
    isAuthorized(true),
    DragonController.getTotalNotifications,
  );
router.route('/reset-notifications')
  .post(
    isAuthorized(true),
    DragonController.resetNotifications,
  );
router.route('/sync-total-stats')
  .get(
    isAuthorized(),
    DragonController.syncTotalStats,
  );
router.route('/sync-skill')
  .get(
    DragonController.syncSkills,
  );
router.route('/sync-skill-dragon')
  .get(
    DragonController.syncSkillsDragon,
  );
router.route('/sync-dragon-image')
  .get(
    DragonController.syncImagesDragon,
  );

/**
 * @swagger
 * /dragons/use-default-skill:
 *   put:
 *     summary: Update use default skill
 *     tags:
 *       - Dragon
 *     parameters:
 *      - in: body
 *        name: body
 *        description: Data
 *        required: true
 *        schema:
 *          type: object
 *          required: true
 *          properties:
 *            dragon:
 *              type: string
 *              example: '614c9e7f5bbb01189137ab77'
 *            skill:
 *              type: string
 *              example: '61efb052d8d8b22ab1ae0197'
 *            useDefault:
 *              type: boolean
 *              example: true
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

router.route('/use-default-skill')
  .put(
    isAuthorized(true),
    DragonController.updateUseDefaultSkill
  );
/**
 * @swagger
 * /dragons/my-dragon:
 *   get:
 *     summary: get my dragons
 *     tags:
 *       - Dragon
 *     parameters:
 *       - name: classDragon
 *         in: query
 *         type: strings
 *         description: 'filter by dragon class: WATER, WOOD...'
 *         required: false
 *       - name: textSearch
 *         in: query
 *         type: strings
 *         description: 'filter by id, name, description'
 *         required: false
 *       - name: type
 *         in: query
 *         type: string
 *         description: 'filter by dragon type: EGG, DRAGON'
 *         required: false
 *       - name: generation
 *         in: query
 *         type: string
 *         description: 'filter by dragon generation: 0, 1, 2'
 *         required: false
 *       - name: order
 *         in: query
 *         type: string
 *         description: 'order dragons: id, type, class, generation. birth'
 *         required: false
 *       - name: orderBy
 *         in: query
 *         type: string
 *         description: 'orderBy dragons: asc, desc'
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
 *       - name: isFree
 *         in: query
 *         type: boolean
 *         description: dragons not belong to a team
 *         required: false
 *     responses:
 *       200:
 *         description: The my dragons
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
 *                 data: [
 *                     {
                            "id": 41,
                            "name": "Dragon #41",
                            "stats": {
                                "mana": 3,
                                "health": 3,
                                "attack": 2,
                                "defend": 3,
                                "speed": 5,
                                "morale": 4
                            },
                            "parents": [],
                            "potential": 0,
                            "generation": 0,
                            "birth": 1629050476000,
                            "hatched": 1631688973000,
                            "class": "WATER",
                            "type": "EGG",
                            "owner": "0x6fAE02e0D916Fb5cFe464Ac0A962dC4858578144"
                        }
 *                 ],
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
 * /dragons:
 *   get:
 *     summary: get dragons
 *     tags:
 *       - Dragon
 *     parameters:
 *       - name: classDragon
 *         in: query
 *         type: strings
 *         description: 'filter by dragon class: WATER, WOOD...'  (format ex: WATER or WATER,WOOD )'
 *         required: false
 *       - name: textSearch
 *         in: query
 *         type: strings
 *         description: 'filter by id, name, description'
 *         required: false
 *       - name: type
 *         in: query
 *         type: string
 *         description: 'filter by dragon type: EGG, DRAGON'
 *         required: false
 *       - name: owner
 *         in: query
 *         type: string
 *         description: 'filter by owner address'
 *         required: false
 *       - name: potential
 *         in: query
 *         type: string
 *         description: 'filter by Potential: from 0 to 4 (format: 0,3)'
 *         required: false
 *       - name: cooldown
 *         in: query
 *         type: string
 *         description: 'cooldownIndex of dragon, (format ex: 0,1 - 2,3 - 4,5 - 6,7 - 8,9 - 10,11 - 12)'
 *         required: false
 *       - name: generation
 *         in: query
 *         type: string
 *         description: 'generation of dragon, (format from,to: ex: 0,4)'
 *         required: false
 *       - name: mana
 *         in: query
 *         type: string
 *         description: 'mana of dragon, (format from,to: ex: 0,4)'
 *       - name: health
 *         in: query
 *         type: string
 *         description: 'health of dragon, (format from,to: ex: 0,4)'
 *       - name: attack
 *         in: query
 *         type: string
 *         description: 'attack of dragon, (format from,to: ex: 0,4)'
 *       - name: defend
 *         in: query
 *         type: string
 *         description: 'defend of dragon, (format from,to: ex: 0,4)'
 *       - name: speed
 *         in: query
 *         type: string
 *         description: 'speed of dragon, (format from,to: ex: 0,4)'
 *       - name: morale
 *         in: query
 *         type: string
 *         description: 'morale of dragon, (format from,to: ex: 0,4)'
 *       - name: sale
 *         in: query
 *         type: string
 *         enum: [ "AUCTION", "SIRING", "NOT_FOR_SALE", "FAVORITES"]
 *         description: 'Type of sale dragon'
 *         required: false
 *       - name: order
 *         in: query
 *         type: string
 *         enum: [ "id", "price", "generation", "potential", "cooldownIndex", "updatedAt", "nextActionAt"]
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
 *         description: The my dragons
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
 *                 data: [
 *                     {
                            "id": 41,
                            "name": "Dragon #41",
                            "stats": {
                                "mana": 3,
                                "health": 3,
                                "attack": 2,
                                "defend": 3,
                                "speed": 5,
                                "morale": 4
                            },
                            "parents": [],
                            "potential": 0,
                            "generation": 0,
                            "birth": 1629050476000,
                            "hatched": 1631688973000,
                            "class": "WATER",
                            "type": "EGG",
                            "owner": "0x6fAE02e0D916Fb5cFe464Ac0A962dC4858578144"
                        }
 *                 ],
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

router.route('/my-dragon')
  .get(
      isAuthorized(true),
      DragonController.getMyDragons,
  );
router.route('/dragon-sale')
  .get(
      DragonController.getDragonRandom,
  );

router.route('/list-dragons')
  .get(
    DragonController.getListDragons,
  );

router.route('/effects')
  .get(
    DragonController.getEffectIcons
  );

router.route('/full-skills')
  .get(
    DragonController.getFullSkills
  );

router.route('/generate-resource-dragons')
  .get(
    DragonController.generateResourceDragons
  )

/**
 * @swagger
 * /dragons/full-skills:
 *   get:
 *     summary: Get full skills
 *     tags:
 *       - Dragon
 *     responses:
 *       200:
 *         description: Get full skills
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
 * /dragons/effects:
 *   get:
 *     summary: Get effect icons
 *     tags:
 *       - Dragon
 *     responses:
 *       200:
 *         description: Get effect icons
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
 * /dragons/{id}:
 *   get:
 *     summary: get dragon detail
 *     tags:
 *       - Dragon
 *     parameters:
 *       - name: id
 *         in: path
 *         type: number
 *         description: 'dragon ID'
 *         required: true
 *     responses:
 *       200:
 *         description: The dragon detail
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: {
        "id": 1,
        "name": "Dragon #1",
        "generation": 0,
        "stats": {
            "mana": 3,
            "health": 5,
            "attack": 5,
            "defend": 3,
            "speed": 2,
            "morale": 1
        },
        "parents": [],
        "potential": 2,
        "birth": 1628965937000,
        "hatched": 1630924600000,
        "class": "METAL",
        "type": "EGG",
        "owner": "0x282ab75b59dbf0a949aacc2827099c5b221e6661"
 *             }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/:id')
  .get(
    isAuthorized(),
    DragonController.getDragon,
  );
router.route('/:id/hatch')
  .get(
    isAuthorized(true),
    DragonController.hatchDragon,
  );

/**
 * @swagger
 * /dragons/{id}/favorites:
 *   post:
 *     summary: favorites or stop favorites dragons
 *     tags:
 *       - Dragon
 *     parameters:
 *       - name: id
 *         in: path
 *         type: number
 *         description: 'dragon ID'
 *         required: true
 *     responses:
 *       200:
 *         description: favorites dragon
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
router.route('/:id/favorites')
  .post(
    isAuthorized(true),
    DragonController.favoritesDragon,
  );

router.route('/:id/skills')
  .get(
    DragonController.getDragonSkills,
  );

router.route('/:id/migrate-data')
  .get(
    DragonController.migrateDataDragon,
  );
router.route('/:id/histories')
  .get(
    DragonController.getDragonHistories,
  );
export default router;
