import { Router } from 'express';
import * as DragonController from './auction.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('')
    .get(
        DragonController.getDragons,
    );
router.route('/migrate-data')
    .get(
        isAuthorized(),
        DragonController.migrateData,
    );
router.route('/update-redis')
    .get(
        isAuthorized(),
        DragonController.updateRedis,
    );
router.route('/check-hash')
    .get(
        isAuthorized(),
        DragonController.checkHash,
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
      isAuthorized(),
      DragonController.getMyDragons,
  );
router.route('/dragon-sale')
  .get(
      DragonController.getDragonRandom,
  );

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
      DragonController.getDragon,
  );
router.route('/:id/hatch')
  .get(
      isAuthorized(),
      DragonController.hatchDragon,
  );

export default router;
